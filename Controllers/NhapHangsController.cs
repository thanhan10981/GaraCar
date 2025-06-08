using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaraCarAPI.Models;
using GaraCar.DTOs;
using ClosedXML.Excel;

namespace GaraCar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhapHangsController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public NhapHangsController(GaraCarContext context)
        {
            _context = context;
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetFilteredNhapHangs(
            [FromQuery] string? search,
            [FromQuery] string? trangThai,
            [FromQuery] DateTime? tuNgay,
            [FromQuery] DateTime? denNgay,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.NhapHangs
                    .Include(x => x.SanPham)
                    .Include(x => x.NhaCungCap)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    var keyword = search.ToLower();
                    query = query.Where(x =>
                        x.SanPham.TenSanPham.ToLower().Contains(keyword) ||
                        x.NhaCungCap.TenNCC.ToLower().Contains(keyword));
                }

                if (!string.IsNullOrWhiteSpace(trangThai))
                {
                    query = query.Where(x => x.TrangThai.ToLower() == trangThai.ToLower());
                }

                if (tuNgay.HasValue)
                    query = query.Where(x => x.ThoiGianTao >= tuNgay);

                if (denNgay.HasValue)
                    query = query.Where(x => x.ThoiGianTao <= denNgay);

                var total = await query.CountAsync();

                // ✅ Tính tổng tiền trước khi gọi Select
                decimal tongTien = await query
                    .Where(x => x.TienNhap.HasValue && !string.IsNullOrEmpty(x.Soluong))
                    .SumAsync(x => x.TienNhap.Value * Convert.ToInt32(x.Soluong));

                // ✅ Sau đó mới gọi Select để lấy DTO
                var data = await query
                    .OrderByDescending(x => x.ThoiGianTao)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(x => new NhapHangDto
                    {
                        MaNhapHang = x.MaNhapHang,
                        TenSanPham = x.SanPham.TenSanPham,
                        TenNCC = x.NhaCungCap.TenNCC,
                        SoLuong = Convert.ToInt32(x.Soluong),
                        ThoiGianTao = x.ThoiGianTao,
                        TrangThai = x.TrangThai,
                        TienNhap = x.TienNhap,
                        TienNo = x.TienNo ?? 0,
                        NguoiTao = x.NguoiTao
                    }).ToListAsync();



                return Ok(new { data, total, tongTien });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("export")]
        public IActionResult ExportToExcel(
            [FromQuery] string? search,
            [FromQuery] string? trangThai,
            [FromQuery] DateTime? tuNgay,
            [FromQuery] DateTime? denNgay)
        {
            try
            {
                var query = _context.NhapHangs
                    .Include(x => x.SanPham)
                    .Include(x => x.NhaCungCap)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    var keyword = search.ToLower();
                    query = query.Where(x =>
                        x.SanPham.TenSanPham.ToLower().Contains(keyword) ||
                        x.NhaCungCap.TenNCC.ToLower().Contains(keyword));
                }

                if (!string.IsNullOrWhiteSpace(trangThai))
                {
                    query = query.Where(x => x.TrangThai.ToLower() == trangThai.ToLower());
                }

                if (tuNgay.HasValue)
                    query = query.Where(x => x.ThoiGianTao >= tuNgay);
                if (denNgay.HasValue)
                    query = query.Where(x => x.ThoiGianTao <= denNgay);

                var list = query.OrderByDescending(x => x.ThoiGianTao).ToList();

                using var workbook = new XLWorkbook();
                var ws = workbook.Worksheets.Add("NhapHang");

                ws.Cell(1, 1).Value = "Mã nhập";
                ws.Cell(1, 2).Value = "Tên sản phẩm";
                ws.Cell(1, 3).Value = "Nhà cung cấp";
                ws.Cell(1, 4).Value = "Số lượng";
                ws.Cell(1, 5).Value = "Thời gian tạo";
                ws.Cell(1, 6).Value = "Trạng thái";
                ws.Cell(1, 7).Value = "Tiền nhập";
                ws.Cell(1, 8).Value = "Tiền nợ";
                ws.Cell(1, 9).Value = "Người tạo";

                for (int i = 0; i < list.Count; i++)
                {
                    var row = i + 2;
                    var nh = list[i];
                    ws.Cell(row, 1).Value = nh.MaNhapHang;
                    ws.Cell(row, 2).Value = nh.SanPham.TenSanPham;
                    ws.Cell(row, 3).Value = nh.NhaCungCap.TenNCC;
                    ws.Cell(row, 4).Value = nh.Soluong;
                    ws.Cell(row, 5).Value = nh.ThoiGianTao.ToString("dd/MM/yyyy HH:mm");
                    ws.Cell(row, 6).Value = nh.TrangThai;
                    ws.Cell(row, 7).Value = nh.TienNhap;
                    ws.Cell(row, 8).Value = nh.TienNo;
                    ws.Cell(row, 9).Value = nh.NguoiTao;
                }

                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                return File(stream.ToArray(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "NhapHang.xlsx");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetNhapHangs()
        {
            try
            {
                var data = await _context.NhapHangs
                    .Include(x => x.SanPham)
                    .Include(x => x.NhaCungCap)
                    .Select(x => new NhapHangDto
                    {
                        MaNhapHang = x.MaNhapHang,
                        MaSanPham = x.MaSanPham,   // ✅ Thêm dòng này
                        MaNCC = x.MaNCC,           // ✅ Thêm dòng này
                        TenSanPham = x.SanPham.TenSanPham,
                        TenNCC = x.NhaCungCap.TenNCC,
                        SoLuong = Convert.ToInt32(x.Soluong),
                        ThoiGianTao = x.ThoiGianTao,
                        TrangThai = x.TrangThai,
                        TienNhap = x.TienNhap,
                        TienNo = x.TienNo ?? 0,
                        NguoiTao = x.NguoiTao
                    })
                    .ToListAsync();

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách nhập hàng: " + ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNhapHang(string id)
        {
            try
            {
                var nh = await _context.NhapHangs
                    .Where(x => x.MaNhapHang == id)
                    .Select(x => new
                    {
                        MaNhapHang = x.MaNhapHang,
                        MaSanPham = x.MaSanPham,
                        MaNCC = x.MaNCC,
                        Soluong = x.Soluong,
                        ThoiGianTao = x.ThoiGianTao,
                        TrangThai = x.TrangThai,
                        TienNhap = x.TienNhap,
                        TienNo = x.TienNo,
                        NguoiTao = x.NguoiTao,
                        TenSanPham = x.SanPham.TenSanPham,
                        TenNCC = x.NhaCungCap.TenNCC
                    })
                    .FirstOrDefaultAsync();

                if (nh == null)
                    return NotFound();

                return Ok(nh);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy chi tiết nhập hàng: " + ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostNhapHang(NhapHang nh)
        {
            try
            {
                if (!await _context.SanPhams.AnyAsync(sp => sp.MaSanPham == nh.MaSanPham))
                    return BadRequest("Sản phẩm không tồn tại");

                if (!await _context.NhaCungCaps.AnyAsync(ncc => ncc.MaNCC == nh.MaNCC))
                    return BadRequest("Nhà cung cấp không tồn tại");

                var maxCode = await _context.NhapHangs
                    .OrderByDescending(x => x.MaNhapHang)
                    .Select(x => x.MaNhapHang)
                    .FirstOrDefaultAsync();

                int nextNumber = 1;
                if (!string.IsNullOrEmpty(maxCode) && maxCode.StartsWith("MNH"))
                {
                    var num = maxCode.Substring(3);
                    if (int.TryParse(num, out var current))
                        nextNumber = current + 1;
                }

                nh.MaNhapHang = "MNH" + nextNumber.ToString("D4");
                nh.NguoiTao ??= "Admin";

                _context.NhapHangs.Add(nh);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetNhapHang), new { id = nh.MaNhapHang }, nh);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutNhapHang(string id, NhapHang nh)
        {

            var existing = await _context.NhapHangs.FindAsync(id);
            if (existing == null) return NotFound("Không tìm thấy");

            existing.MaSanPham = nh.MaSanPham;
            existing.MaNCC = nh.MaNCC;
            existing.Soluong = nh.Soluong;
            existing.ThoiGianTao = nh.ThoiGianTao;
            existing.TrangThai = nh.TrangThai;
            existing.TienNhap = nh.TienNhap;
            existing.TienNo = nh.TienNo;
            existing.NguoiTao = nh.NguoiTao;

            _context.Entry(existing).Reference(x => x.SanPham).IsModified = false;
            _context.Entry(existing).Reference(x => x.NhaCungCap).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhapHang(string id)
        {
            var nh = await _context.NhapHangs.FindAsync(id);
            if (nh == null) return NotFound();

            _context.NhapHangs.Remove(nh);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
