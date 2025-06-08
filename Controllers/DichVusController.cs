using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaraCarAPI.Models;
using ClosedXML.Excel;
using GaraCar.DTOs;


namespace GaraCar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DichVusController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public DichVusController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/DichVus
        [HttpGet]
        public IActionResult GetDV(
        [FromQuery] string? search,
        [FromQuery] string? searchType,
        [FromQuery] string? MaDichVu,
        [FromQuery] string? TenDichVu,
        [FromQuery] decimal? giamin,
        [FromQuery] decimal? giamax)
        {
            var query = _context.DichVus.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                if (searchType == "MaDichVu")
                    query = query.Where(dv => dv.MaDichVu.Contains(search));
                else if (searchType == "TenDichVu")
                    query = query.Where(dv => dv.TenDichVu.Contains(search));
            }

            if (!string.IsNullOrEmpty(MaDichVu))
                query = query.Where(dv => dv.MaDichVu == MaDichVu);

            if (!string.IsNullOrEmpty(TenDichVu))
                query = query.Where(dv => dv.TenDichVu.Contains(TenDichVu));

            if (giamin.HasValue)
                query = query.Where(dv => dv.DonGia >= giamin.Value);

            if (giamax.HasValue)
                query = query.Where(dv => dv.DonGia <= giamax.Value);

            var result = query.Select(dv => new DichVuDto
            {
                MaDichVu = dv.MaDichVu,
                TenDichVu = dv.TenDichVu,
                DonGia = dv.DonGia
            }).ToList();

            return Ok(result);
        }


        // GET: api/DichVus/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DichVuDto>> GetDichVu(string id)
        {
            var dichVu = await _context.DichVus.FindAsync(id);
            if (dichVu == null) return NotFound();

            var dto = new DichVuDto
            {
                MaDichVu = dichVu.MaDichVu,
                TenDichVu = dichVu.TenDichVu,
                DonGia = dichVu.DonGia
            };

            return dto;
        }

        [HttpGet("export")]
        public IActionResult ExportToExcel()
        {
            var dichVus = _context.DichVus.ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("DanhSachDichVu");
                worksheet.Cell(1, 1).Value = "Mã dịch vụ";
                worksheet.Cell(1, 2).Value = "Tên dịch vụ";
                worksheet.Cell(1, 3).Value = "Đơn giá";

                for (int i = 0; i < dichVus.Count; i++)
                {
                    worksheet.Cell(i + 2, 1).Value = dichVus[i].MaDichVu;
                    worksheet.Cell(i + 2, 2).Value = dichVus[i].TenDichVu;
                    worksheet.Cell(i + 2, 3).Value = dichVus[i].DonGia;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content,
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                "DanhSachDichVu.xlsx");
                }
            }
        }



        // PUT: api/DichVus/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDichVu(string id, DichVuDto dto)
        {
            if (id != dto.MaDichVu)
                return BadRequest();

            var dichVu = await _context.DichVus.FindAsync(id);
            if (dichVu == null) return NotFound();

            dichVu.TenDichVu = dto.TenDichVu;
            dichVu.DonGia = dto.DonGia;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/DichVus
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DichVuDto>> PostDichVu(DichVuDto dto)
        {
            // ✅ Tìm mã lớn nhất hiện tại
            var maxCode = await _context.DichVus
                .OrderByDescending(d => d.MaDichVu)
                .Select(d => d.MaDichVu)
                .FirstOrDefaultAsync();

            // ✅ Tính số thứ tự kế tiếp
            int nextNumber = 1;
            if (!string.IsNullOrEmpty(maxCode) && maxCode.StartsWith("DV"))
            {
                var numberPart = maxCode.Substring(2); // bỏ "DV"
                if (int.TryParse(numberPart, out int currentNumber))
                {
                    nextNumber = currentNumber + 1;
                }
            }

            // ✅ Tạo mã mới theo định dạng DV00001
            var newMaDichVu = "DV" + nextNumber.ToString("D5");

            var dichVu = new DichVu
            {
                MaDichVu = newMaDichVu,
                TenDichVu = dto.TenDichVu,
                DonGia = dto.DonGia
            };

            _context.DichVus.Add(dichVu);
            await _context.SaveChangesAsync();

            dto.MaDichVu = dichVu.MaDichVu;
            return CreatedAtAction(nameof(GetDichVu), new { id = dichVu.MaDichVu }, dto);
        }



        // DELETE: api/DichVus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDichVu(string id)
        {
            var dichVu = await _context.DichVus.FindAsync(id);
            if (dichVu == null)
                return NotFound();

            _context.DichVus.Remove(dichVu);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool DichVuExists(string id)
        {
            return _context.DichVus.Any(e => e.MaDichVu == id);
        }
    }
}
