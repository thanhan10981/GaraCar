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
    public class SoQuysController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public SoQuysController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/SoQuys
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SoQuy>>> GetSoQuys()
        {
            return await _context.SoQuys.ToListAsync();
        }
      
        [HttpGet("phan-trang-loc")]
        public async Task<IActionResult> GetSoQuyLocPhanTrang(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? loaiQuy = null, // tiền mặt, chuyển khoản, tổng quỹ
        [FromQuery] string? tuNgay = null,
        [FromQuery] string? denNgay = null,
        [FromQuery] string? loaiChungTu = null, // phieuThu, phieuChi
        [FromQuery] string? loaiThuChi = null,
        [FromQuery] string? trangThai = null,
        [FromQuery] string? nhanVien = null,
        [FromQuery] string? keyword = null)
        {
            var query = _context.SoQuys.AsQueryable();

            // 🔍 Từ khóa tìm kiếm
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var kw = keyword.Trim().ToLower();
                query = query.Where(p =>
                    p.MaPhieu.ToLower().Contains(kw) ||
                    p.NguoiNhan.ToLower().Contains(kw));
            }

            // 🔍 Loại quỹ (Tiền mặt / Chuyển khoản / Tổng quỹ)
            if (!string.IsNullOrEmpty(loaiQuy) && loaiQuy != "tongQuy")
            {
                if (loaiQuy == "tienMat")
                    query = query.Where(p => p.PhuongThucThanhToan == "Tiền mặt");
                else if (loaiQuy == "nganHang")
                    query = query.Where(p => p.PhuongThucThanhToan == "Chuyển khoản");
            }

            // 🔍 Lọc theo loại chứng từ: "phieuThu", "phieuChi"
            if (!string.IsNullOrEmpty(loaiChungTu))
            {
                if (loaiChungTu == "phieuThu")
                    query = query.Where(p => p.LoaiThuChi == "Phiếu thu");
                else if (loaiChungTu == "phieuChi")
                    query = query.Where(p => p.LoaiThuChi == "Phiếu chi");
            }

            // 🔍 Loại thu chi cụ thể
            if (!string.IsNullOrEmpty(loaiThuChi))
            {
                query = query.Where(p => p.GhiChu.Contains(loaiThuChi));
            }

            // 🔍 Trạng thái
            if (!string.IsNullOrEmpty(trangThai))
            {
                if (trangThai == "daThanhToan")
                    query = query.Where(p => p.TrangThai == "Đã thanh toán");
                else if (trangThai == "daHuy")
                    query = query.Where(p => p.TrangThai == "Đã hủy");
            }


            // 🔍 Nhân viên
            if (!string.IsNullOrEmpty(nhanVien))
                query = query.Where(p => p.NhanVien == nhanVien);

            var list = await query.ToListAsync();

            if (!string.IsNullOrEmpty(tuNgay) && DateTime.TryParse(tuNgay, out var tu))
            {
                list = list.Where(q => q.ThoiGian >= tu).ToList();
            }

            if (!string.IsNullOrEmpty(denNgay) && DateTime.TryParse(denNgay, out var den))
            {
                den = den.AddDays(1).AddSeconds(-1); // tính đến cuối ngày
                list = list.Where(q => q.ThoiGian <= den).ToList();
            }

            // Tính lại tổng và phân trang thủ công
            var total = list.Count;
            var data = list.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();


            Response.Headers.Add("Access-Control-Expose-Headers", "X-Total-Count");
            Response.Headers.Add("X-Total-Count", total.ToString());

            return Ok(data);
        }

        // GET: api/SoQuys/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SoQuy>> GetSoQuy(string id)
        {
            var soQuy = await _context.SoQuys.FindAsync(id);

            if (soQuy == null)
            {
                return NotFound();
            }

            return soQuy;
        }
        [HttpPut("{maPhieu}/cap-nhat-nv-pt")]
        public async Task<IActionResult> CapNhatNhanVienVaPhuongThuc(string maPhieu,
           [FromForm] string NhanVien,
           [FromForm] string PhuongThucThanhToan)
        {
            var sq = await _context.SoQuys.FindAsync(maPhieu);
            if (sq == null) return NotFound();

            sq.NhanVien = NhanVien;
            sq.PhuongThucThanhToan = PhuongThucThanhToan;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet("tong-hop")]
        public IActionResult GetTongHopSoQuy()
        {
            var all = _context.SoQuys.ToList();

            var tongThu = all
                .Where(x => x.LoaiThuChi != null && x.LoaiThuChi.Trim().ToLower() == "phiếu thu")
               .Sum(x => x.GiaTri );

            var tongChi = all
                .Where(x => x.LoaiThuChi != null && x.LoaiThuChi.Trim().ToLower() == "phiếu chi")
             .Sum(x => x.GiaTri);

            var quyDauKy = 10000000; // 👉 Có thể sau này lấy từ bảng khác

            return Ok(new
            {
                quyDauKy,
                tongThu,
                tongChi,
                tonQuy = quyDauKy + tongThu - tongChi
            });
        }



        // PUT: api/SoQuys/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSoQuy(string id, SoQuy soQuy)
        {
            if (id != soQuy.MaPhieu)
            {
                return BadRequest();
            }

            _context.Entry(soQuy).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SoQuyExists(id))
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

        // POST: api/SoQuys
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SoQuy>> PostSoQuy([FromForm] SoQuyDto dto)
        {
            var soQuy = new SoQuy
            {
                MaPhieu = dto.MaPhieu,
                ThoiGian = dto.ThoiGian,
                GiaTri = dto.GiaTri,
                NguoiNhan = dto.NguoiNhan,
                SoDienThoai = dto.SoDienThoai,
                DiaChi = dto.DiaChi,
                LoaiThuChi = dto.LoaiThuChi,
                TrangThai = dto.TrangThai,
                NguoiTao = dto.NguoiTao,
                NhanVien = dto.NhanVien,
                DoiTuongNhan = dto.DoiTuongNhan,
                GhiChu = dto.GhiChu,
                PhuongThucThanhToan = dto.PhuongThucThanhToan
            };

            _context.SoQuys.Add(soQuy);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SoQuyExists(soQuy.MaPhieu))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSoQuy", new { id = soQuy.MaPhieu }, soQuy);
        }

        [HttpGet("export")]
        public IActionResult ExportToExcel()
        {
            var danhSach = _context.SoQuys.ToList();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("SoQuy");
            var currentRow = 1;

            // 🔰 HEADER
            string[] headers = {
        "Mã phiếu", "Thời gian", "Giá trị", "Người nhận", "SĐT", "Địa chỉ",
        "Loại thu chi", "Trạng thái", "Người tạo", "Nhân viên", "Đối tượng nhận",
        "Ghi chú", "Phương thức TT"
    };

            for (int i = 0; i < headers.Length; i++)
            {
                worksheet.Cell(currentRow, i + 1).Value = headers[i];
            }

            // 🌟 Format header
            var headerRange = worksheet.Range(1, 1, 1, headers.Length);
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.BackgroundColor = XLColor.TealBlue;
            headerRange.Style.Font.FontColor = XLColor.White;
            headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            headerRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            headerRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            headerRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

            // 📄 DỮ LIỆU
            foreach (var c in danhSach)
            {
                currentRow++;
                worksheet.Cell(currentRow, 1).Value = c.MaPhieu;
                worksheet.Cell(currentRow, 2).Value = c.ThoiGian;
                worksheet.Cell(currentRow, 3).Value = c.GiaTri;
                worksheet.Cell(currentRow, 4).Value = c.NguoiNhan;
                worksheet.Cell(currentRow, 5).Value = c.SoDienThoai;
                worksheet.Cell(currentRow, 6).Value = c.DiaChi;
                worksheet.Cell(currentRow, 7).Value = c.LoaiThuChi;
                worksheet.Cell(currentRow, 8).Value = c.TrangThai;
                worksheet.Cell(currentRow, 9).Value = c.NguoiTao;
                worksheet.Cell(currentRow, 10).Value = c.NhanVien;
                worksheet.Cell(currentRow, 11).Value = c.DoiTuongNhan;
                worksheet.Cell(currentRow, 12).Value = c.GhiChu;
                worksheet.Cell(currentRow, 13).Value = c.PhuongThucThanhToan;
            }

            worksheet.Columns().AdjustToContents(); // tự động giãn cột

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var content = stream.ToArray();

            return File(content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"SoQuy_{DateTime.Now:yyyyMMdd}.xlsx");
        }

        
        [HttpDelete("xoa-nhieu")]
        public async Task<IActionResult> XoaNhieu([FromBody] List<string> maPhieus)
        {
            var phieuCanXoa = _context.SoQuys.Where(p => maPhieus.Contains(p.MaPhieu));
            _context.SoQuys.RemoveRange(phieuCanXoa);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        private bool SoQuyExists(string id)
        {
            return _context.SoQuys.Any(e => e.MaPhieu == id);
        }
    }
}
