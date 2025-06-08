using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaraCarAPI.Models;
using GaraCarAPI.DTOs;
using ClosedXML.Excel;
using System.Text;
using GaraCar.DTOs;
using Microsoft.IdentityModel.Tokens;

namespace GaraCar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoaDonsController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public HoaDonsController(GaraCarContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoaDonDto>>> GetHoaDons()
        {
            var hoaDons = await _context.HoaDons
                .Include(h => h.KhachHang)
                .OrderByDescending(h => h.ThoiGian)
                .Select(h => new HoaDonDto
                {
                    MaHoaDon = h.MaHoaDon,
                    MaKhachHang = h.MaKhachHang,
                    TenKhachHang = h.KhachHang.TenKhachHang,
                    MaNhanVien = h.MaNhanVien,
                    TenNhanVien = h.NhanVien.TenNhanVien,
                    ThoiGian = h.ThoiGian,
                    TongTien = h.TongTien,
                    TrangThai = h.TrangThai,
                    PhuongThucThanhToan = h.PhuongThucThanhToan,
                }).ToListAsync();

            return Ok(hoaDons);
        }

        [HttpGet("filter")]
        public async Task<ActionResult<object>> GetFilteredHoaDons(
    [FromQuery] string? search,
    [FromQuery] string? trangThai,
    [FromQuery] string? tuNgay,
    [FromQuery] string? denNgay,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            var query = _context.HoaDons
                .Include(x => x.KhachHang)
                .Include(x => x.NhanVien)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var keyword = search.ToLower();
                query = query.Where(x =>
                    x.MaHoaDon.ToLower().Contains(keyword) ||
                    (x.KhachHang != null && x.KhachHang.TenKhachHang.ToLower().Contains(keyword)) ||
                    (x.NhanVien != null && x.NhanVien.TenNhanVien.ToLower().Contains(keyword))
                );
            }

            if (!string.IsNullOrWhiteSpace(trangThai))
            {
                query = query.Where(x => x.TrangThai.ToLower() == trangThai.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(tuNgay) && DateTime.TryParse(tuNgay, out var tu))
            {
                query = query.Where(x => x.ThoiGian >= tu);
            }

            if (!string.IsNullOrWhiteSpace(denNgay) && DateTime.TryParse(denNgay, out var den))
            {
                query = query.Where(x => x.ThoiGian <= den);
            }

            var total = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.ThoiGian)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new HoaDonDto
                {
                    MaHoaDon = x.MaHoaDon,
                    TenKhachHang = x.KhachHang.TenKhachHang,
                    TenNhanVien = x.NhanVien.TenNhanVien,
                    ThoiGian = x.ThoiGian,
                    NgayGiaoDuKien = x.NgayGiaoDuKien,
                    TrangThai = x.TrangThai,
                    PhuongThucThanhToan = x.PhuongThucThanhToan,
                    TongTien = x.TongTien
                }).ToListAsync();

            return Ok(new { data, total });
        }




        [HttpGet("export")]
        public IActionResult ExportToExcel([FromQuery] string? trangThai)
        {
            var query = _context.HoaDons.Include(h => h.KhachHang).AsQueryable();

            if (!string.IsNullOrEmpty(trangThai))
                query = query.Where(h => h.TrangThai == trangThai);

            var list = query.OrderByDescending(h => h.ThoiGian).ToList();

            using var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add("HoaDon");
            ws.Cell(1, 1).Value = "Mã HĐ";
            ws.Cell(1, 2).Value = "Khách hàng";
            ws.Cell(1, 3).Value = "Ngày";
            ws.Cell(1, 4).Value = "Tổng tiền";
            ws.Cell(1, 5).Value = "Trạng thái";

            for (int i = 0; i < list.Count; i++)
            {
                var row = i + 2;
                ws.Cell(row, 1).Value = list[i].MaHoaDon;
                ws.Cell(row, 2).Value = list[i].KhachHang.TenKhachHang;
                ws.Cell(row, 3).Value = list[i].ThoiGian.ToString("dd/MM/yyyy HH:mm");
                ws.Cell(row, 4).Value = list[i].TongTien;
                ws.Cell(row, 5).Value = list[i].TrangThai;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var content = stream.ToArray();
            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "DanhSachHoaDon.xlsx");
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HoaDon>> GetHoaDon(string id)
        {
            var hoaDon = await _context.HoaDons
                .Include(h => h.KhachHang)
                .Include(h => h.SanPhamHoaDons)
                .ThenInclude(sp => sp.SanPham)
                .FirstOrDefaultAsync(h => h.MaHoaDon == id);

            if (hoaDon == null) return NotFound();

            return hoaDon;
        }

        [HttpPost]
        public async Task<ActionResult<HoaDon>> PostHoaDon(HoaDon hoaDon)
        {
            hoaDon.MaHoaDon = GenerateMaHoaDon();
            _context.HoaDons.Add(hoaDon);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHoaDon), new { id = hoaDon.MaHoaDon }, hoaDon);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutHoaDon(string id, HoaDon hoaDon)
        {
            if (id != hoaDon.MaHoaDon) return BadRequest("Mã hóa đơn không khớp");
            var existingHoaDon = await _context.HoaDons.FindAsync(id);
            if (existingHoaDon == null) return NotFound("Không tìm thấy hóa đơn với id: " + id);
            existingHoaDon.MaKhachHang = hoaDon.MaKhachHang;
            existingHoaDon.MaNhanVien = hoaDon.MaNhanVien;
            existingHoaDon.ThoiGian = hoaDon.ThoiGian;
            existingHoaDon.TongTien = hoaDon.TongTien;
            existingHoaDon.TrangThai = hoaDon.TrangThai;
            existingHoaDon.PhuongThucThanhToan = hoaDon.PhuongThucThanhToan;
            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi khi cập nhật hóa đơn",
                    detail = ex.ToString()
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoaDon(string id)
        {
            var hoaDon = await _context.HoaDons.FindAsync(id);
            if (hoaDon == null) return NotFound();
            _context.HoaDons.Remove(hoaDon);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool HoaDonExists(string id) => _context.HoaDons.Any(h => h.MaHoaDon == id);

        private string GenerateMaHoaDon()
        {
            var last = _context.HoaDons.OrderByDescending(h => h.MaHoaDon).FirstOrDefault()?.MaHoaDon;
            int number = int.TryParse(last?.Replace("HD", ""), out var n) ? n + 1 : 1;
            return $"HD{number.ToString("D6")}";
        }
    }
}
