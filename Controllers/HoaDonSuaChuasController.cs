using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaraCarAPI.Models;
using GaraCar.DTOs;

namespace GaraCar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoaDonSuaChuasController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public HoaDonSuaChuasController(GaraCarContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoaDonSuaChuaDto>>> GetHoaDonSuaChuas()
        {
            var hoaDons = await _context.HoaDonSuaChuas
                .Include(h => h.NhanVien)
                .Include(h => h.YeuCauSuaChua)
                .OrderByDescending(h => h.NgayLap)
                .Select(h => new HoaDonSuaChuaDto
                {
                    MaHoaDon = h.MaHoaDon,
                    MaYeuCau = h.MaYeuCau,
                    TenYeuCau = h.YeuCauSuaChua.MoTa,
                    MaNhanVien = h.MaNhanVien,
                    TenNhanVien = h.NhanVien.TenNhanVien,
                    NgayLap = h.NgayLap,
                    ThoiGianHoanThanhDuKien = h.ThoiGianHoanThanhDuKien,
                    TrangThai = h.TrangThai,
                    TongTien = (decimal)h.TongTien,
                    PhuongThucThanhToan = h.PhuongThucThanhToan
                }).ToListAsync();

            return Ok(hoaDons);
        }
        // GET: api/HoaDonSuaChuas/filter
        [HttpGet("filter")]
        public async Task<ActionResult<object>> GetFiltered(
            [FromQuery] string? search,
            [FromQuery] string? trangThai,
            [FromQuery] DateTime? tuNgay,
            [FromQuery] DateTime? denNgay,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.HoaDonSuaChuas
                .Include(h => h.NhanVien)
                .Include(h => h.YeuCauSuaChua)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                var keyword = search.ToLower();
                query = query.Where(h =>
                    h.MaHoaDon.ToLower().Contains(keyword) ||
                    (h.NhanVien != null && h.NhanVien.TenNhanVien.ToLower().Contains(keyword)) ||
                    (h.YeuCauSuaChua != null && h.YeuCauSuaChua.MoTa.ToLower().Contains(keyword))
                );
            }


            if (!string.IsNullOrEmpty(trangThai))
                query = query.Where(h => h.TrangThai.ToLower() == trangThai.ToLower());

            if (tuNgay.HasValue)
                query = query.Where(h => h.NgayLap >= tuNgay);

            if (denNgay.HasValue)
                query = query.Where(h => h.NgayLap <= denNgay);

            var total = await query.CountAsync();

            var result = await query
                .OrderByDescending(h => h.NgayLap)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(h => new HoaDonSuaChuaDto
                {
                    MaHoaDon = h.MaHoaDon,
                    MaYeuCau = h.MaYeuCau,
                    TenYeuCau = h.YeuCauSuaChua.MoTa,
                    MaNhanVien = h.MaNhanVien,
                    TenNhanVien = h.NhanVien.TenNhanVien,
                    NgayLap = h.NgayLap,
                    ThoiGianHoanThanhDuKien = h.ThoiGianHoanThanhDuKien,
                    TrangThai = h.TrangThai,
                    TongTien = (decimal)h.TongTien,
                    PhuongThucThanhToan = h.PhuongThucThanhToan
                }).ToListAsync();

            var tongTien = await query.SumAsync(h => h.TongTien);

            return Ok(new { data = result, total, tongTien });
        }

        // GET: api/HoaDonSuaChuas/export
        [HttpGet("export")]
        public async Task<IActionResult> ExportToExcel()
        {
            var data = await _context.HoaDonSuaChuas
                .Include(h => h.NhanVien)
                .Include(h => h.YeuCauSuaChua)
                .OrderByDescending(h => h.NgayLap)
                .ToListAsync();

            using (var workbook = new ClosedXML.Excel.XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Hóa đơn sửa chữa");

                // Header
                worksheet.Cell(1, 1).Value = "Mã HĐ";
                worksheet.Cell(1, 2).Value = "Mã Yêu Cầu";
                worksheet.Cell(1, 3).Value = "Tên Yêu Cầu";
                worksheet.Cell(1, 4).Value = "Nhân Viên";
                worksheet.Cell(1, 5).Value = "Ngày Lập";
                worksheet.Cell(1, 6).Value = "Hoàn Thành Dự Kiến";
                worksheet.Cell(1, 7).Value = "Trạng Thái";
                worksheet.Cell(1, 8).Value = "Tổng Tiền";
                worksheet.Cell(1, 9).Value = "Phương Thức TT";

                int row = 2;
                foreach (var hd in data)
                {
                    worksheet.Cell(row, 1).Value = hd.MaHoaDon;
                    worksheet.Cell(row, 2).Value = hd.MaYeuCau;
                    worksheet.Cell(row, 3).Value = hd.YeuCauSuaChua?.MoTa;
                    worksheet.Cell(row, 4).Value = hd.NhanVien?.TenNhanVien;
                    worksheet.Cell(row, 5).Value = hd.NgayLap.ToString("dd/MM/yyyy");
                    worksheet.Cell(row, 6).Value = hd.ThoiGianHoanThanhDuKien.ToString("dd/MM/yyyy");
                    worksheet.Cell(row, 7).Value = hd.TrangThai;
                    worksheet.Cell(row, 8).Value = hd.TongTien;
                    worksheet.Cell(row, 9).Value = hd.PhuongThucThanhToan;
                    row++;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "HoaDonSuaChua.xlsx");
                }
            }
        }


        // GET: api/HoaDonSuaChuas/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<HoaDonSuaChua>> GetHoaDonSuaChua(string id)
        {
            var hoaDon = await _context.HoaDonSuaChuas.FindAsync(id);
            if (hoaDon == null) return NotFound();
            return hoaDon;
        }

        // POST: api/HoaDonSuaChuas
        [HttpPost]
        public async Task<ActionResult<HoaDonSuaChua>> PostHoaDonSuaChua(HoaDonSuaChua hoaDon)
        {
            var maxMa = await _context.HoaDonSuaChuas
                .OrderByDescending(h => h.MaHoaDon)
                .Select(h => h.MaHoaDon)
                .FirstOrDefaultAsync();

            int next = 1;
            if (!string.IsNullOrEmpty(maxMa) && maxMa.StartsWith("HDSC"))
            {
                if (int.TryParse(maxMa.Substring(4), out int curr))
                    next = curr + 1;
            }

            hoaDon.MaHoaDon = "HDSC" + next.ToString("D5");
            _context.HoaDonSuaChuas.Add(hoaDon);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHoaDonSuaChua), new { id = hoaDon.MaHoaDon }, hoaDon);
        }

        // PUT: api/HoaDonSuaChuas/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHoaDonSuaChua(string id, [FromBody] HoaDonSuaChua updated)
        {
            if (id != updated.MaHoaDon)
                return BadRequest("Mã hóa đơn không khớp");
           

            var existing = await _context.HoaDonSuaChuas.FindAsync(id);
            if (existing == null)
            {
                return NotFound(new { message = "Không tìm thấy hóa đơn với id: " + id });
            }
            if (existing == null)
                return NotFound();

            // Gán thủ công từng trường – bỏ qua navigation
            existing.MaYeuCau = updated.MaYeuCau;
            existing.MaNhanVien = updated.MaNhanVien;
            existing.NgayLap = updated.NgayLap;
            existing.ThoiGianHoanThanhDuKien = updated.ThoiGianHoanThanhDuKien;
            existing.TrangThai = updated.TrangThai;
            existing.TongTien = updated.TongTien;
            existing.PhuongThucThanhToan = updated.PhuongThucThanhToan;
            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi khi cập nhật hóa đơn",
                    detail = ex.ToString()
                });
            }
        }

        // DELETE: api/HoaDonSuaChuas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoaDonSuaChua(string id)
        {
            var hoaDon = await _context.HoaDonSuaChuas.FindAsync(id);
            if (hoaDon == null) return NotFound();

            _context.HoaDonSuaChuas.Remove(hoaDon);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool HoaDonSuaChuaExists(string id)
        {
            return _context.HoaDonSuaChuas.Any(e => e.MaHoaDon == id);
        }
    }
}
