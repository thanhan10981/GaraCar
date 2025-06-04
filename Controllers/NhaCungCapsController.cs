using ClosedXML.Excel;
using GaraCar.DTOs;
using GaraCarAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GaraCar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhaCungCapsController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public NhaCungCapsController(GaraCarContext context)
        {
            _context = context;
        }
        // API đơn giản dùng cho getAll()
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.NhaCungCaps.ToListAsync();
            return Ok(data);
        }

        // GET: api/NhaCungCaps
        [HttpGet]
        public async Task<IActionResult> getFilteredProviders(
     [FromQuery] string? keyword,
    [FromQuery] string? nhomNCC,
    [FromQuery] string? trangThai,
    [FromQuery] decimal? fromAmount,
    [FromQuery] decimal? toAmount,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            var query = _context.NhaCungCaps.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                keyword = keyword.ToLower();
                query = query.Where(p =>
                    p.MaNCC.ToLower().Contains(keyword) ||
                    p.TenNCC.ToLower().Contains(keyword) ||
                    p.SDT.ToLower().Contains(keyword));
            }

            if (!string.IsNullOrEmpty(nhomNCC))
            {
                var normalized = nhomNCC.Trim().ToLower();
                query = query.Where(p => p.NhomNCC != null && p.NhomNCC.Trim().ToLower() == normalized);
            }


            if (!string.IsNullOrEmpty(trangThai) && trangThai != "tatca")
                query = query.Where(p => p.TrangThai == trangThai);

            if (fromAmount.HasValue)
            {
                query = query.Where(p =>
                    !string.IsNullOrWhiteSpace(p.TongTien) &&
                    Convert.ToDecimal(p.TongTien) >= fromAmount.Value);
            }

            if (toAmount.HasValue)
            {
                query = query.Where(p =>
                    !string.IsNullOrWhiteSpace(p.TongTien) &&
                    Convert.ToDecimal(p.TongTien) <= toAmount.Value);
            }


            var total = await query.CountAsync();

            var data = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { data, total });
        }



        // GET: api/NhaCungCaps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NhaCungCap>> GetNhaCungCap(string id)
        {
            var nhaCungCap = await _context.NhaCungCaps.FindAsync(id);

            if (nhaCungCap == null)
            {
                return NotFound();
            }

            return nhaCungCap;
        }

        // PUT: api/NhaCungCaps/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNhaCungCap(string id, [FromForm] NhaCungCapDto dto)
        {
            var nhaCungCap = await _context.NhaCungCaps.FindAsync(id);
            if (nhaCungCap == null)
                return NotFound();

            nhaCungCap.TenNCC = dto.TenNCC;
            nhaCungCap.SDT = dto.SDT;
            nhaCungCap.DiaChi = dto.DiaChi;
            nhaCungCap.PhuongXa = dto.PhuongXa;
            nhaCungCap.CongTy = dto.CongTy;
            nhaCungCap.MaSoThue = dto.MaSoThue;
            nhaCungCap.Email = dto.Email;
            nhaCungCap.TrangThai = dto.TrangThai;
            nhaCungCap.TongTien = dto.TongTien;
            nhaCungCap.GhiChu = dto.GhiChu;
            nhaCungCap.NhomNCC = dto.NhomNCC;
            nhaCungCap.NguoiTao = dto.NguoiTao;
            nhaCungCap.NgayTao = dto.NgayTao;


            // ✅ Xử lý file nếu có
            if (dto.HinhAnh != null && dto.HinhAnh.Length > 0)
            {
                var extension = Path.GetExtension(dto.HinhAnh.FileName);
                var safeFileName = $"{Guid.NewGuid()}{extension}";
                var savePath = Path.Combine("wwwroot/images", safeFileName);

                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await dto.HinhAnh.CopyToAsync(stream);
                }

                nhaCungCap.HinhAnh = $"/images/{safeFileName}";
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("nhom-nccs")]
        public IActionResult GetNhomNCCs()
        {
            var groups = _context.NhaCungCaps
                .Where(n => !string.IsNullOrEmpty(n.NhomNCC))
                .Select(n => n.NhomNCC.Trim())
                .Distinct()
                .ToList();

            return Ok(groups);
        }


        // POST: api/NhaCungCaps
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NhaCungCap>> PostNhaCungCap([FromForm] NhaCungCapDto dto)
        {
            try
            {
                var nhaCungCap = new NhaCungCap
                {
                    MaNCC = dto.MaNCC,
                    TenNCC = dto.TenNCC,
                    SDT = dto.SDT,
                    DiaChi = dto.DiaChi,
                    PhuongXa = dto.PhuongXa,
                    Email = dto.Email,
                    CongTy = dto.CongTy,
                    MaSoThue = dto.MaSoThue,
                    NhomNCC = dto.NhomNCC,
                    NguoiTao = dto.NguoiTao,
                    NgayTao = dto.NgayTao,
                    TongTien = dto.TongTien,
                    TrangThai = dto.TrangThai,
                    GhiChu = dto.GhiChu
                };

                // Xử lý ảnh nếu có
                if (dto.HinhAnh != null && dto.HinhAnh.Length > 0)
                {
                    var extension = Path.GetExtension(dto.HinhAnh.FileName);
                    var fileName = $"{Guid.NewGuid()}{extension}";
                    var savePath = Path.Combine("wwwroot/images", fileName);

                    using (var stream = new FileStream(savePath, FileMode.Create))
                    {
                        await dto.HinhAnh.CopyToAsync(stream);
                    }

                    nhaCungCap.HinhAnh = $"/images/{fileName}";
                }

                _context.NhaCungCaps.Add(nhaCungCap);

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    if (NhaCungCapExists(nhaCungCap.MaNCC))
                        return Conflict();
                    else
                        throw;
                }

                return CreatedAtAction("GetNhaCungCap", new { id = nhaCungCap.MaNCC }, nhaCungCap);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }

        }


        // DELETE: api/NhaCungCaps/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhaCungCap(string id)
        {
            // 1. Tìm và xóa các bản ghi nhập hàng liên quan
            var nhapHangs = _context.NhapHangs.Where(n => n.MaNCC == id).ToList();
            _context.NhapHangs.RemoveRange(nhapHangs);

            // 2. Xóa nhà cung cấp
            var nhaCungCap = await _context.NhaCungCaps.FindAsync(id);
            _context.NhaCungCaps.Remove(nhaCungCap);

            // 3. Lưu thay đổi
            await _context.SaveChangesAsync();


            return NoContent();
        }


        private bool NhaCungCapExists(string id)
        {
            return _context.NhaCungCaps.Any(e => e.MaNCC == id);
        }
        [HttpGet("export")]
        public IActionResult ExportNhaCungCapToExcel()
        {
            var providers = _context.NhaCungCaps.ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("NhaCungCap");
                var currentRow = 1;

                // Header
                worksheet.Cell(currentRow, 1).Value = "Mã NCC";
                worksheet.Cell(currentRow, 2).Value = "Tên NCC";
                worksheet.Cell(currentRow, 3).Value = "SĐT";
                worksheet.Cell(currentRow, 4).Value = "Email";
                worksheet.Cell(currentRow, 5).Value = "Địa chỉ";
                worksheet.Cell(currentRow, 6).Value = "Phường/xã";
                worksheet.Cell(currentRow, 7).Value = "Công ty";
                worksheet.Cell(currentRow, 8).Value = "Mã số thuế";
                worksheet.Cell(currentRow, 9).Value = "Nhóm NCC";
                worksheet.Cell(currentRow, 10).Value = "Người tạo";
                worksheet.Cell(currentRow, 11).Value = "Ngày tạo";
                worksheet.Cell(currentRow, 12).Value = "Tổng mua";
                worksheet.Cell(currentRow, 13).Value = "Trạng thái";
                worksheet.Cell(currentRow, 14).Value = "Ghi chú";

                // 🌈 Định dạng header
                var headerRange = worksheet.Range(1, 1, 1, 14);
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Fill.BackgroundColor = XLColor.SkyBlue;
                headerRange.Style.Font.FontColor = XLColor.White;
                headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                headerRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

                // Dữ liệu
                foreach (var ncc in providers)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = ncc.MaNCC;
                    worksheet.Cell(currentRow, 2).Value = ncc.TenNCC;
                    worksheet.Cell(currentRow, 3).Value = ncc.SDT;
                    worksheet.Cell(currentRow, 4).Value = ncc.Email;
                    worksheet.Cell(currentRow, 5).Value = ncc.DiaChi;
                    worksheet.Cell(currentRow, 6).Value = ncc.PhuongXa;
                    worksheet.Cell(currentRow, 7).Value = ncc.CongTy;
                    worksheet.Cell(currentRow, 8).Value = ncc.MaSoThue;
                    worksheet.Cell(currentRow, 9).Value = ncc.NhomNCC;
                    worksheet.Cell(currentRow, 10).Value = ncc.NguoiTao;
                    worksheet.Cell(currentRow, 11).Value = ncc.NgayTao.ToString("dd/MM/yyyy HH:mm");
                    worksheet.Cell(currentRow, 12).Value = ncc.TongTien;
                    worksheet.Cell(currentRow, 13).Value = ncc.TrangThai;
                    worksheet.Cell(currentRow, 14).Value = ncc.GhiChu;
                }

                worksheet.Columns().AdjustToContents(); // Giãn cột vừa nội dung

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"NhaCungCap_{DateTime.Now:yyyyMMdd}.xlsx");
                }
            }
        }


        [HttpPost("import")]
        public async Task<IActionResult> ImportNhaCungCap(IFormFile file)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("Vui lòng chọn file Excel.");

                var providers = new List<NhaCungCap>();
                var nextNumber = GetNextProviderNumber(); // Sinh mã NCC mới

                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;

                    using (var package = new ExcelPackage(stream))
                    {
                        if (package.Workbook.Worksheets.Count == 0)
                            return BadRequest("File Excel không có sheet nào.");

                        var worksheet = package.Workbook.Worksheets.First();

                        if (worksheet.Dimension == null)
                            return BadRequest("Sheet không có dữ liệu.");

                        int rowCount = worksheet.Dimension.Rows;

                        for (int row = 2; row <= rowCount; row++)
                        {
                            var provider = new NhaCungCap
                            {
                                MaNCC = $"NCC0{nextNumber}",
                                TenNCC = worksheet.Cells[row, 1].Text,
                                SDT = worksheet.Cells[row, 2].Text,
                                Email = worksheet.Cells[row, 3].Text,
                                DiaChi = worksheet.Cells[row, 4].Text,
                                PhuongXa = worksheet.Cells[row, 5].Text,
                                CongTy = worksheet.Cells[row, 6].Text,
                                MaSoThue = worksheet.Cells[row, 7].Text,
                                NhomNCC = worksheet.Cells[row, 8].Text,
                                NguoiTao = "admin",
                                TongTien = worksheet.Cells[row, 10].Text ?? "0",
                                TrangThai =  "Đang hoạt động",
                                GhiChu = worksheet.Cells[row, 12].Text,
                                NgayTao = DateTime.Now
                            };

                            providers.Add(provider);
                            nextNumber++;
                        }
                    }
                }

                _context.NhaCungCaps.AddRange(providers);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Đã import {providers.Count} nhà cung cấp thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi import: {ex.Message}");
            }
        }

        private int GetNextProviderNumber()
        {
            var last = _context.NhaCungCaps
                .OrderByDescending(x => x.MaNCC)
                .FirstOrDefault();

            if (last != null && last.MaNCC.StartsWith("NCC") &&
                int.TryParse(last.MaNCC.Substring(3), out int lastNum))
            {
                return lastNum + 1;
            }

            return 1;
        }

        [HttpGet("download-template")]
        public IActionResult DownloadImportTemplate()
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("MauImport");

                // Danh sách header
                var headers = new[]
                {
            "TenNCC", "SDT", "Email", "DiaChi", "PhuongXa", "CongTy",
            "MaSoThue", "NhomNCC", "NguoiTao", "TongTien", "TrangThai", "GhiChu"
        };

                // Tạo hàng header
                for (int i = 0; i < headers.Length; i++)
                {
                    var cell = worksheet.Cell(1, i + 1);
                    cell.Value = headers[i];
                    cell.Style.Font.Bold = true;
                    cell.Style.Fill.BackgroundColor = XLColor.LightSkyBlue;
                    cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                }

                // Thêm dòng ví dụ (minh họa – tùy chọn)
                worksheet.Cell(2, 1).Value = "Công ty ABC";
                worksheet.Cell(2, 2).Value = "0912345678";
                worksheet.Cell(2, 3).Value = "abc@email.com";
                worksheet.Cell(2, 4).Value = "123 Đường A";
                worksheet.Cell(2, 5).Value = "Phường 5";
                worksheet.Cell(2, 6).Value = "TNHH ABC";
                worksheet.Cell(2, 7).Value = "0123456789";
                worksheet.Cell(2, 8).Value = "Nhóm A";
                worksheet.Cell(2, 9).Value = "admin";
                worksheet.Cell(2, 10).Value = "5000000";
                worksheet.Cell(2, 11).Value = "Đang hoạt động";
                worksheet.Cell(2, 12).Value = "Ghi chú mẫu";

                // Viền toàn bộ bảng (header + dòng mẫu)
                var dataRange = worksheet.Range(1, 1, 2, headers.Length);
                dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                dataRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;

                worksheet.Rows().AdjustToContents();
                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "MauImport_NhaCungCap.xlsx");
                }
            }
        }


    }
}
