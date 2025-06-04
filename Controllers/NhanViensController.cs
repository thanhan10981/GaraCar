using ClosedXML.Excel;
using GaraCar.DTOs;
using GaraCarAPI.Models;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GaraCar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhanViensController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public NhanViensController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/NhanViens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NhanVien>>> GetNhanViens()
        {
            return await _context.NhanViens.ToListAsync();
        }

        // GET: api/NhanViens/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NhanVien>> GetNhanVien(string id)
        {
            var nhanVien = await _context.NhanViens.FindAsync(id);

            if (nhanVien == null)
            {
                return NotFound();
            }

            return nhanVien;
        }

        // PUT: api/NhanViens/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNhanVien(string id, [FromForm] NhanVienDto dto)
        {
            try
            {
                var nhanVien = await _context.NhanViens.FindAsync(id);
                if (nhanVien == null)
                    return NotFound();

                nhanVien.TenNhanVien = dto.TenNhanVien;
                nhanVien.SoDienThoai = dto.SoDienThoai;
                nhanVien.NgaySinh = dto.NgaySinh;
                nhanVien.GioiTinh = dto.GioiTinh;
                nhanVien.DiaChi = dto.DiaChi;
                nhanVien.NgayBatDau = dto.NgayBatDau;
                nhanVien.ChucVu = dto.ChucVu;
                nhanVien.TaiKhoanDangNhap = dto.TaiKhoanDangNhap;
                nhanVien.MatKhau = dto.MatKhau;
                nhanVien.CmndCccd = dto.CmndCccd;
                nhanVien.Email = dto.Email;
                nhanVien.Facebook = dto.Facebook;
                nhanVien.TrangThai = dto.TrangThai;
                nhanVien.GhiChu = dto.GhiChu;

                if (dto.HinhAnh != null && dto.HinhAnh.Length > 0)
                {
                    var extension = Path.GetExtension(dto.HinhAnh.FileName);
                    var fileName = $"{Guid.NewGuid()}{extension}";
                    var savePath = Path.Combine("wwwroot/images", fileName);
                    Directory.CreateDirectory("wwwroot/images");

                    using (var stream = new FileStream(savePath, FileMode.Create))
                    {
                        await dto.HinhAnh.CopyToAsync(stream);
                    }

                    nhanVien.HinhAnh = $"/images/{fileName}";
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message, inner = ex.InnerException?.Message });
            }
        }



        // POST: api/NhanViens
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostNhanVien([FromForm] NhanVienDto nhanVienDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(nhanVienDto.MaNhanVien))
                    return BadRequest(new { message = "Mã nhân viên không được để trống" });

                if (string.IsNullOrWhiteSpace(nhanVienDto.TenNhanVien))
                    return BadRequest(new { message = "Tên nhân viên không được để trống" });

                if (string.IsNullOrWhiteSpace(nhanVienDto.Email))
                    return BadRequest(new { message = "Email không được để trống" });

                if (string.IsNullOrWhiteSpace(nhanVienDto.MatKhau))
                    return BadRequest(new { message = "Mật khẩu không được để trống" });
                var nhanVien = new NhanVien
                {
                    MaNhanVien = nhanVienDto.MaNhanVien,
                    TenNhanVien = nhanVienDto.TenNhanVien,
                    SoDienThoai = nhanVienDto.SoDienThoai,
                    NgaySinh = nhanVienDto.NgaySinh,
                    GioiTinh = nhanVienDto.GioiTinh,
                    DiaChi = nhanVienDto.DiaChi,
                    NgayBatDau = nhanVienDto.NgayBatDau,
                    ChucVu = nhanVienDto.ChucVu,
                    TaiKhoanDangNhap = nhanVienDto.TaiKhoanDangNhap,
                    MatKhau = nhanVienDto.MatKhau,
                    CmndCccd = nhanVienDto.CmndCccd,
                    Email = nhanVienDto.Email,
                    Facebook = nhanVienDto.Facebook,
                    GhiChu = nhanVienDto.GhiChu,
                    TrangThai = nhanVienDto.TrangThai,
                };

                if (nhanVienDto.HinhAnh != null && nhanVienDto.HinhAnh.Length > 0)
                {
                    var extension = Path.GetExtension(nhanVienDto.HinhAnh.FileName);
                    var fileName = $"{Guid.NewGuid()}{extension}";
                    var savePath = Path.Combine("wwwroot/images", fileName);

                    using (var stream = new FileStream(savePath, FileMode.Create))
                    {
                        await nhanVienDto.HinhAnh.CopyToAsync(stream);
                    }

                    nhanVien.HinhAnh = $"/images/{fileName}";
                }

                _context.NhanViens.Add(nhanVien);
                await _context.SaveChangesAsync();

                return Ok(nhanVien);
            }
            catch (Exception ex)
            {
                var inner = ex.InnerException;
                while (inner?.InnerException != null)
                {
                    inner = inner.InnerException;
                }

                var fullMessage = inner?.Message ?? ex.Message;
                return StatusCode(500, new { message = fullMessage });
            }

        }


        // DELETE: api/NhanViens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhanVien(string id)
        {
            var nhanVien = await _context.NhanViens.FindAsync(id);
            if (nhanVien == null)
            {
                return NotFound();
            }

            _context.NhanViens.Remove(nhanVien);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("export")]
        public IActionResult ExportNhanVien()
        {
            var nhanViens = _context.NhanViens.ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("NhanVien");
                var currentRow = 1;

                // Header
                worksheet.Cell(currentRow, 1).Value = "Mã nhân viên";
                worksheet.Cell(currentRow, 2).Value = "Tên nhân viên";
                worksheet.Cell(currentRow, 3).Value = "SĐT";
                worksheet.Cell(currentRow, 4).Value = "Email";
                worksheet.Cell(currentRow, 5).Value = "Địa chỉ";
                worksheet.Cell(currentRow, 6).Value = "Ngày sinh";
                worksheet.Cell(currentRow, 7).Value = "Giới tính";
                worksheet.Cell(currentRow, 8).Value = "Chức vụ";
                worksheet.Cell(currentRow, 9).Value = "CMND/CCCD";
                worksheet.Cell(currentRow, 10).Value = "Facebook";
                worksheet.Cell(currentRow, 11).Value = "Trạng thái";
                worksheet.Cell(currentRow, 12).Value = "Ghi chú";

                // Format header
                var headerRange = worksheet.Range(1, 1, 1, 11);
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Fill.BackgroundColor = XLColor.DarkCyan;
                headerRange.Style.Font.FontColor = XLColor.White;
                headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                // Dữ liệu
                foreach (var nv in nhanViens)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = nv.MaNhanVien;
                    worksheet.Cell(currentRow, 2).Value = nv.TenNhanVien;
                    worksheet.Cell(currentRow, 3).Value = nv.SoDienThoai;
                    worksheet.Cell(currentRow, 4).Value = nv.Email;
                    worksheet.Cell(currentRow, 5).Value = nv.DiaChi;
                    worksheet.Cell(currentRow, 6).Value = nv.NgaySinh;
                    worksheet.Cell(currentRow, 7).Value = nv.GioiTinh;
                    worksheet.Cell(currentRow, 8).Value = nv.ChucVu;
                    worksheet.Cell(currentRow, 9).Value = nv.CmndCccd;
                    worksheet.Cell(currentRow, 10).Value = nv.Facebook;
                    worksheet.Cell(currentRow, 11).Value = nv.GhiChu;
                    worksheet.Cell(currentRow, 12).Value = nv.TrangThai;
                }

                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"NhanVien_{DateTime.Now:yyyyMMdd}.xlsx");
                }
            }
        }
        [HttpPost("import")]
        public async Task<IActionResult> ImportNhanVien(IFormFile file)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("Vui lòng chọn file Excel.");

                var employees = new List<NhanVien>();

                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;

                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                        if (worksheet?.Dimension == null)
                            return BadRequest("File không chứa dữ liệu hợp lệ.");

                        int rowCount = worksheet.Dimension.Rows;
                        int nextCode = _context.NhanViens.Count() + 1;

                        for (int row = 2; row <= rowCount; row++)
                        {
                            var nv = new NhanVien
                            {
                                MaNhanVien = $"NV{nextCode:D6}",
                                TenNhanVien = worksheet.Cells[row, 1].Text,
                                SoDienThoai = worksheet.Cells[row, 2].Text,
                                Email = worksheet.Cells[row, 3].Text,
                                DiaChi = worksheet.Cells[row, 4].Text,
                                NgaySinh = worksheet.Cells[row, 5].Text,
                                GioiTinh = worksheet.Cells[row, 6].Text,
                                ChucVu = worksheet.Cells[row, 7].Text,
                                CmndCccd = worksheet.Cells[row, 8].Text,
                                Facebook = worksheet.Cells[row, 9].Text,
                                GhiChu = worksheet.Cells[row, 10].Text,
                                TrangThai = worksheet.Cells[row, 11].Text,
                            };
                            employees.Add(nv);
                            nextCode++;
                        }
                    }
                }

                _context.NhanViens.AddRange(employees);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Import thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi khi import: {ex.Message}");
            }
        }
        [HttpGet("template")]
        public IActionResult DownloadNhanVienTemplate()
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("MauImportNhanVien");

            // 🌟 Header
            string[] headers = {
        "Tên nhân viên", "Số điện thoại", "Email", "Địa chỉ", "Ngày sinh (dd/MM/yyyy)",
        "Giới tính", "Chức vụ", "Tài khoản", "Mật khẩu", "CMND/CCCD", "Facebook", "Ghi chú", "Trạng thái"
    };

            for (int i = 0; i < headers.Length; i++)
            {
                var cell = worksheet.Cell(1, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
                cell.Style.Fill.BackgroundColor = XLColor.DarkCyan;
                cell.Style.Font.FontColor = XLColor.White;
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }

            // 🌟 Dòng dữ liệu mẫu
            var sampleRow = new[]
            {
        "Nguyễn Văn A", "0901234567", "a@gmail.com", "123 Đường ABC", "01/01/1995",
        "Nam", "Nhân viên", "user123", "matkhau123", "123456789", "fb.com/user", "Ghi chú mẫu", "Đang hoạt động"
    };

            for (int i = 0; i < sampleRow.Length; i++)
            {
                var cell = worksheet.Cell(2, i + 1);
                cell.Value = sampleRow[i];
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }

            // 🌟 Giãn cột
            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return File(stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"MauImportNhanVien_{DateTime.Now:yyyyMMdd}.xlsx");
        }


        [HttpPost("dang-nhap")]
        public async Task<IActionResult> DangNhap([FromForm] NhanVien loginData)
        {
            if (string.IsNullOrEmpty(loginData.TaiKhoanDangNhap) || string.IsNullOrEmpty(loginData.MatKhau))
                return BadRequest("Thiếu tài khoản hoặc mật khẩu");

            var user = await _context.NhanViens.FirstOrDefaultAsync(x =>
                x.TaiKhoanDangNhap == loginData.TaiKhoanDangNhap &&
                x.MatKhau == loginData.MatKhau &&  // 🔐 Đã mã hóa từ frontend
                x.TrangThai == "Đang hoạt động");

            if (user == null)
                return Unauthorized("Sai tài khoản hoặc mật khẩu");

            return Ok(new
            {
                MaNhanVien = user.MaNhanVien,
                TenNhanVien = user.TenNhanVien,
                ChucVu = user.ChucVu
            });
        }




        private bool NhanVienExists(string id)
        {
            return _context.NhanViens.Any(e => e.MaNhanVien == id);
        }
    }
}
