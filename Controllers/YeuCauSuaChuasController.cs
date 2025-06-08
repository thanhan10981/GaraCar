using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaraCarAPI.Models;
using GaraCar.DTOs;
using ClosedXML.Excel;

namespace GaraCar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YeuCauSuaChuasController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public YeuCauSuaChuasController(GaraCarContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<YeuCauSuaChua>>> GetYeuCauSuaChuas()
        {
            return await _context.YeuCauSuaChuas.ToListAsync();
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<YeuCauSuaChua>>> GetFiltered(
                       [FromQuery] string? search,
                                  [FromQuery] string? trangThai,
                                             [FromQuery] DateTime? tuNgay,
                                                        [FromQuery] DateTime? denNgay,
                                                                   [FromQuery] int page = 1,
                                                                              [FromQuery] int pageSize = 10)
        {
            var query = _context.YeuCauSuaChuas.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                var keyword = search.ToLower();
                query = query.Where(y => y.MaYeuCau.ToLower().Contains(keyword) || y.BienSoXe.ToLower().Contains(keyword));
            }

            if (!string.IsNullOrEmpty(trangThai))
                query = query.Where(y => y.TrangThai.ToLower() == trangThai.ToLower());

            if (tuNgay.HasValue)
                query = query.Where(y => y.ThoiGianTao >= tuNgay);

            if (denNgay.HasValue)
                query = query.Where(y => y.ThoiGianTao <= denNgay);

            var total = await query.CountAsync();

            var result = await query
                .OrderByDescending(y => y.ThoiGianTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Add("X-Total-Count", total.ToString());
            return result;
        }

        // ✅ Lấy chi tiết theo mã yêu cầu
        [HttpGet("{id}")]
        public async Task<ActionResult<YeuCauSuaChua>> GetYeuCauSuaChua(string id)
        {
            var yeuCau = await _context.YeuCauSuaChuas.FindAsync(id);
            return yeuCau == null ? NotFound() : yeuCau;
        }

        // ✅ Xuất file Excel
        [HttpGet("export")]
        public async Task<IActionResult> ExportYeuCauToExcel()
        {
            var data = await _context.YeuCauSuaChuas.ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("YeuCauSuaChua");

            worksheet.Cell(1, 1).Value = "Mã yêu cầu";
            worksheet.Cell(1, 2).Value = "Biển số";
            worksheet.Cell(1, 3).Value = "Ngày đặt";
            worksheet.Cell(1, 4).Value = "Trạng thái";

            for (int i = 0; i < data.Count; i++)
            {
                worksheet.Cell(i + 2, 1).Value = data[i].MaYeuCau;
                worksheet.Cell(i + 2, 2).Value = data[i].BienSoXe;
                worksheet.Cell(i + 2, 3).Value = data[i].NgayDat.ToString("yyyy-MM-dd");
                worksheet.Cell(i + 2, 4).Value = data[i].TrangThai;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "yeucau_suachua.xlsx");
        }

        // ✅ Cập nhật yêu cầu
        [HttpPut("{id}")]
        public async Task<IActionResult> PutYeuCauSuaChua(string id, YeuCauSuaChua yeuCau)
        {
            if (id != yeuCau.MaYeuCau)
                return BadRequest();

            _context.Entry(yeuCau).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!YeuCauSuaChuaExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // ✅ Xóa yêu cầu
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteYeuCauSuaChua(string id)
        {
            var yeuCau = await _context.YeuCauSuaChuas.FindAsync(id);
            if (yeuCau == null)
                return NotFound();

            _context.YeuCauSuaChuas.Remove(yeuCau);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool YeuCauSuaChuaExists(string id)
        {
            return _context.YeuCauSuaChuas.Any(e => e.MaYeuCau == id);
        }
    }
}
