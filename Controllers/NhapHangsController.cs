using ClosedXML.Excel;
using GaraCar.DTOs;
using GaraCarAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        // GET: api/NhapHangs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NhapHang>>> GetNhapHangs()
        {
            return await _context.NhapHangs.ToListAsync();
        }

        // GET: api/NhapHangs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NhapHang>> GetNhapHang(string id)
        {
            var nhapHang = await _context.NhapHangs.FindAsync(id);

            if (nhapHang == null)
            {
                return NotFound();
            }

            return nhapHang;
        }
        [HttpGet("by-ncc/{maNcc}")]
        public async Task<ActionResult<IEnumerable<NhapHangDto>>> GetByMaNCC(string maNcc)
        {
            var result = await _context.NhapHangs
                .Include(n => n.SanPham)
                .Include(n => n.NhaCungCap)
                .Where(n => n.MaNCC == maNcc)
                .Select(n => new NhapHangDto
                {
                    MaNhapHang = n.MaNhapHang,
                    MaSanPham = n.MaSanPham,
                    MaNCC = n.MaNCC,
                    Soluong = n.Soluong,
                    ThoiGianTao = n.ThoiGianTao,
                    TrangThai = n.TrangThai,
                    TienNhap = n.TienNhap,
                    SanPham = n.SanPham,
                    NhaCungCap = n.NhaCungCap
                })
                .ToListAsync();

            return Ok(result);
        }
        [HttpGet("xuat-lich-su-nhap")]
        public async Task<IActionResult> ExportNhapHangHistory([FromQuery] string maNCC)
        {
            var nhapHangs = await _context.NhapHangs
                .Where(n => n.MaNCC == maNCC)
                .Include(n => n.SanPham)
                .Include(n => n.NhaCungCap)
                .ToListAsync();

            if (nhapHangs == null || !nhapHangs.Any())
                return NotFound("Không có dữ liệu để xuất");

            try
            {
                using var workbook = new ClosedXML.Excel.XLWorkbook();
                var worksheet = workbook.Worksheets.Add("LichSuNhapHang");

                // Tên cột
                string[] headers = {
                    "Mã nhập hàng", "Mã sản phẩm", "Tên NCC", "Thời gian",
                    "Người tạo", "Số lượng", "Tổng cộng","Tiền nợ", "Trạng thái"
                };

                // Ghi và định dạng header
                for (int col = 0; col < 9; col++)
                {
                    var cell = worksheet.Cell(1, col + 1);
                    cell.Value = headers[col];
                    cell.Style.Font.Bold = true;
                    cell.Style.Font.FontSize = 12;
                    cell.Style.Fill.BackgroundColor = XLColor.LightSteelBlue;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                }

                // Freeze dòng tiêu đề
                worksheet.SheetView.FreezeRows(1);

                // (Tùy chọn) Tự động giãn cột sau khi ghi dữ liệu
                worksheet.Columns().AdjustToContents();

                // Data
                for (int i = 0; i < nhapHangs.Count; i++)
                {
                    var row = i + 2;
                    var nh = nhapHangs[i];
                    worksheet.Cell(row, 1).Value = nh.MaNhapHang;
                    worksheet.Cell(row, 2).Value = nh.MaSanPham;
                    worksheet.Cell(row, 3).Value = nh.NhaCungCap?.TenNCC;
                    worksheet.Cell(row, 4).Value = nh.ThoiGianTao.ToString("dd/MM/yyyy HH:mm");
                    worksheet.Cell(row, 5).Value = nh.NguoiTao;
                    worksheet.Cell(row, 6).Value = nh.Soluong;
                    worksheet.Cell(row, 7).Value = nh.TienNhap;
                    worksheet.Cell(row, 8).Value = nh.TienNo;
                    worksheet.Cell(row, 9).Value = nh.TrangThai;
                }

                // Đừng dùng using cho stream ở đây!
                var stream = new MemoryStream();
                workbook.SaveAs(stream);

                stream.Position = 0; // hoặc stream.Seek(0, SeekOrigin.Begin);

                var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                var fileName = $"LichSuNhap_{maNCC}_{DateTime.Now:yyyyMMddHHmmss}.xlsx";

                return File(stream, contentType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi xuất file: {ex.Message}");
            }
        }



        // PUT: api/NhapHangs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNhapHang(string id, NhapHang nhapHang)
        {
            if (id != nhapHang.MaNhapHang)
            {
                return BadRequest();
            }

            _context.Entry(nhapHang).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NhapHangExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/NhapHangs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NhapHang>> PostNhapHang(NhapHang nhapHang)
        {
            _context.NhapHangs.Add(nhapHang);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (NhapHangExists(nhapHang.MaNhapHang))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetNhapHang", new { id = nhapHang.MaNhapHang }, nhapHang);
        }

        // DELETE: api/NhapHangs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhapHang(string id)
        {
            var nhapHang = await _context.NhapHangs.FindAsync(id);
            if (nhapHang == null)
            {
                return NotFound();
            }

            _context.NhapHangs.Remove(nhapHang);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NhapHangExists(string id)
        {
            return _context.NhapHangs.Any(e => e.MaNhapHang == id);
        }
    }
}
