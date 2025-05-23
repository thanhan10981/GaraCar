using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaraCarAPI.Models;
using GaraCarAPI.DTOs;
using ClosedXML.Excel;
using OfficeOpenXml;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;

namespace GaraCar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhachHangsController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public KhachHangsController(GaraCarContext context)
        {
            _context = context;
        }

        // GET: api/KhachHangs
        [HttpGet]
        public IActionResult Get(
       [FromQuery] string? creator,
       [FromQuery] string? loaiKhach,
       [FromQuery] string? trangThai,
       [FromQuery] string? search,
       [FromQuery] string? searchType,
       [FromQuery] DateTime? fromDate,
       [FromQuery] DateTime? toDate)
        {
            var query = _context.KhachHangs.AsQueryable();

            if (!string.IsNullOrEmpty(loaiKhach) && loaiKhach.ToLower() != "tatca")
                query = query.Where(x => x.LoaiKhach != null && x.LoaiKhach.Trim().ToLower() == loaiKhach.Trim().ToLower());

            if (!string.IsNullOrEmpty(creator))
                query = query.Where(x => x.NguoiTao != null && x.NguoiTao.Trim().ToLower() == creator.Trim().ToLower());

            if (!string.IsNullOrEmpty(trangThai) && trangThai.ToLower() != "tatca")
                query = query.Where(x => x.TrangThai != null && x.TrangThai.Trim().ToLower() == trangThai.Trim().ToLower());

            if (!string.IsNullOrEmpty(search))
            {
                switch (searchType)
                {
                    case "code":
                        query = query.Where(x =>
                            (x.MaKhachHang != null && x.MaKhachHang.Contains(search)) ||
                            (x.TenKhachHang != null && x.TenKhachHang.Contains(search)) ||
                            (x.SoDienThoai != null && x.SoDienThoai.Contains(search)));
                        break;
                    case "email":
                        query = query.Where(x => x.Email != null && x.Email.Contains(search));
                        break;
                    case "address":
                        query = query.Where(x => x.DiaChi != null && x.DiaChi.Contains(search));
                        break;
                    case "note":
                        query = query.Where(x => x.GhiChu != null && x.GhiChu.Contains(search));
                        break;
                }
            }

            var result = query.ToList();

            if (fromDate.HasValue && toDate.HasValue)
            {
                result = result.Where(x =>
                                     x.NgayTao >= fromDate.Value &&
                                     x.NgayTao <= toDate.Value
                                 ).ToList();

            }


            return Ok(result);
        }





        // GET: api/KhachHangs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<KhachHang>> GetKhachHang(string id)
        {
            var khachHang = await _context.KhachHangs.FindAsync(id);

            if (khachHang == null)
            {
                return NotFound();
            }

            return khachHang;
        }

        // PUT: api/KhachHangs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKhachHang(string id, [FromForm] KhachHangDto khachHangs)
        {
            if (id.Trim().ToLower() != khachHangs.MaKhachHang.Trim().ToLower())
            {
                return BadRequest("Mã khách hàng không khớp.");
            }

            var existingCustomer = await _context.KhachHangs.FindAsync(id);
            if (existingCustomer == null)
            {
                return NotFound();
            }


            // Cập nhật các trường
            existingCustomer.TenKhachHang = khachHangs.TenKhachHang;
            existingCustomer.SoDienThoai = khachHangs.SoDienThoai;
            existingCustomer.NgaySinh = khachHangs.NgaySinh;
            existingCustomer.GioiTinh = khachHangs.GioiTinh;
            existingCustomer.DiaChi = khachHangs.DiaChi;
            existingCustomer.LoaiKhach = khachHangs.LoaiKhach;
            existingCustomer.MaSoThue = khachHangs.MaSoThue;
            existingCustomer.CmndCccd = khachHangs.CmndCccd;
            existingCustomer.Email = khachHangs.Email;
            existingCustomer.Facebook = khachHangs.Facebook;
            existingCustomer.GhiChu = khachHangs.GhiChu;
            existingCustomer.TrangThai = khachHangs.TrangThai;
            existingCustomer.NguoiTao = khachHangs.NguoiTao;
            existingCustomer.NgayTao = khachHangs.NgayTao;

            // Cập nhật ảnh nếu có
            if (khachHangs.HinhAnh != null)
            {
                var extension = Path.GetExtension(khachHangs.HinhAnh.FileName);
                var safeFileName = $"{Guid.NewGuid()}{extension}";
                var savePath = Path.Combine("wwwroot/images", safeFileName);

                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await khachHangs.HinhAnh.CopyToAsync(stream);
                }

                existingCustomer.HinhAnh = $"/images/{safeFileName}";
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KhachHangExists(id))
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

        // ✅ HÀM KIỂM TRA SỰ TỒN TẠI
        private bool KhachHangExists(string id)
        {
            return _context.KhachHangs.Any(e => e.MaKhachHang == id);
        }



        // POST: api/KhachHangs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // File: Controllers/KhachHangController.cs
        [HttpPost]
        public async Task<ActionResult<KhachHang>> PostKhachHang([FromForm] KhachHangDto khachHangs)
        {
            var khachHang = new KhachHang
            {
                MaKhachHang = khachHangs.MaKhachHang,
                TenKhachHang = khachHangs.TenKhachHang,
                SoDienThoai = khachHangs.SoDienThoai,
                Email = khachHangs.Email,
                DiaChi = khachHangs.DiaChi,
                NgaySinh = khachHangs.NgaySinh,
                GioiTinh = khachHangs.GioiTinh,
                LoaiKhach = khachHangs.LoaiKhach,
                MaSoThue = khachHangs.MaSoThue,
                CmndCccd = khachHangs.CmndCccd,
                Facebook = khachHangs.Facebook,
                GhiChu = khachHangs.GhiChu,
                NgayTao = khachHangs.NgayTao,
                NguoiTao = khachHangs.NguoiTao,
                TrangThai = khachHangs.TrangThai
            };

            if (khachHangs.HinhAnh != null)
            {
                var extension = Path.GetExtension(khachHangs.HinhAnh.FileName);
                var safeFileName = $"{Guid.NewGuid()}{extension}";
                var savePath = Path.Combine("wwwroot/images", safeFileName);

                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await khachHangs.HinhAnh.CopyToAsync(stream);
                }

                khachHang.HinhAnh = $"/images/{safeFileName}";
            }

            _context.KhachHangs.Add(khachHang);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (KhachHangExists(khachHang.MaKhachHang!))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetKhachHang", new { id = khachHang.MaKhachHang }, khachHang);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKhachHang(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Thiếu mã khách hàng.");
            }

            // Tải dữ liệu liên quan
            var khachHang = await _context.KhachHangs
            .Include(k => k.HoaDons).ThenInclude(h => h.PhieuBaoHanhs)
            .Include(k => k.XeKhachHangs)
                .ThenInclude(xe => xe.YeuCauSuaChuas)
                    .ThenInclude(y => y.HoaDonSuaChuas) // ⚠️ Bắt buộc phải có để xoá thủ công
            .FirstOrDefaultAsync(k => k.MaKhachHang == id);


            // Nếu tồn tại
            if (khachHang != null)
            {
                // Xóa sâu: Phải xóa theo thứ tự liên kết ngược
                foreach (var xe in khachHang.XeKhachHangs)
                {
                    _context.YeuCauSuaChuas.RemoveRange(xe.YeuCauSuaChuas);
                }

                foreach (var hoaDon in khachHang.HoaDons)
                {
                    _context.PhieuBaoHanhs.RemoveRange(hoaDon.PhieuBaoHanhs);
                }

                _context.XeKhachHangs.RemoveRange(khachHang.XeKhachHangs);
                _context.HoaDons.RemoveRange(khachHang.HoaDons);
                _context.KhachHangs.Remove(khachHang);

                await _context.SaveChangesAsync();

                return NoContent();
            }

            // ✅ Nếu không tìm thấy khách hàng
            return NotFound();
        }
        [HttpGet("export")]
        public IActionResult ExportToExcel()
        {
            var customers = _context.KhachHangs.ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("KhachHang");
                var currentRow = 1;

                // Header
                worksheet.Cell(currentRow, 1).Value = "Mã KH";
                worksheet.Cell(currentRow, 2).Value = "Tên khách hàng";
                worksheet.Cell(currentRow, 3).Value = "SĐT";
                worksheet.Cell(currentRow, 4).Value = "Email";
                worksheet.Cell(currentRow, 5).Value = "Địa chỉ";
                worksheet.Cell(currentRow, 6).Value = "Ngày sinh";
                worksheet.Cell(currentRow, 7).Value = "Giới tính";
                worksheet.Cell(currentRow, 8).Value = "Loại khách";
                worksheet.Cell(currentRow, 9).Value = "Mã số thuế";
                worksheet.Cell(currentRow, 10).Value = "CMND/CCCD";
                worksheet.Cell(currentRow, 11).Value = "Facebook";
                worksheet.Cell(currentRow, 12).Value = "Ghi chú";
                worksheet.Cell(currentRow, 13).Value = "Người tạo";
                worksheet.Cell(currentRow, 14).Value = "Ngày tạo";
                worksheet.Cell(currentRow, 15).Value = "Trạng thái";

                // 🌈 Format Header
                var headerRange = worksheet.Range(1, 1, 1, 15); // Hàng 1, từ cột 1 đến 15
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Fill.BackgroundColor = XLColor.TealBlue;
                headerRange.Style.Font.FontColor = XLColor.White;
                headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                headerRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;

                // Content
                foreach (var c in customers)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = c.MaKhachHang;
                    worksheet.Cell(currentRow, 2).Value = c.TenKhachHang;
                    worksheet.Cell(currentRow, 3).Value = c.SoDienThoai;
                    worksheet.Cell(currentRow, 4).Value = c.Email;
                    worksheet.Cell(currentRow, 5).Value = c.DiaChi;
                    worksheet.Cell(currentRow, 6).Value = c.NgaySinh;
                    worksheet.Cell(currentRow, 7).Value = c.GioiTinh;
                    worksheet.Cell(currentRow, 8).Value = c.LoaiKhach;
                    worksheet.Cell(currentRow, 9).Value = c.MaSoThue;
                    worksheet.Cell(currentRow, 10).Value = c.CmndCccd;
                    worksheet.Cell(currentRow, 11).Value = c.Facebook;
                    worksheet.Cell(currentRow, 12).Value = c.GhiChu;
                    worksheet.Cell(currentRow, 13).Value = c.NguoiTao;
                    worksheet.Cell(currentRow, 14).Value = c.NgayTao;
                    worksheet.Cell(currentRow, 15).Value = c.TrangThai;
                }

                worksheet.Columns().AdjustToContents(); // Tự động giãn cột

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                         $"KhachHang_{DateTime.Now:yyyyMMdd}.xlsx");
                }
            }
        }
        [HttpPost("import")]
        public async Task<IActionResult> ImportKhachHang(IFormFile file)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {

                if (file == null || file.Length == 0)
                return BadRequest("Vui lòng chọn file Excel.");

            var customers = new List<KhachHang>();
            var nextNumber = GetNextCustomerNumber(); // Số khởi đầu

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                stream.Position = 0; // RẤT QUAN TRỌNG

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
                        var customer = new KhachHang
                        {
                            MaKhachHang = $"KH{nextNumber.ToString("D6")}",
                            TenKhachHang = worksheet.Cells[row, 1].Text,
                            SoDienThoai = worksheet.Cells[row, 2].Text,
                            Email = worksheet.Cells[row, 3].Text,
                            DiaChi = worksheet.Cells[row, 4].Text,
                            NgaySinh = worksheet.Cells[row, 5].Text,
                            GioiTinh = worksheet.Cells[row, 6].Text,
                            LoaiKhach = worksheet.Cells[row, 7].Text,
                            MaSoThue = worksheet.Cells[row, 8].Text,
                            CmndCccd = worksheet.Cells[row, 9].Text,
                            Facebook = worksheet.Cells[row, 10].Text,
                            GhiChu = worksheet.Cells[row, 11].Text,
                            NguoiTao = worksheet.Cells[row, 12].Text,
                            NgayTao = DateTime.Parse(worksheet.Cells[row, 13].Text),
                            TrangThai = worksheet.Cells[row, 14].Text
                        };

                        customers.Add(customer);
                        nextNumber++;
                    }
                }
            }

            _context.KhachHangs.AddRange(customers);
            await _context.SaveChangesAsync();
                return Ok(new { message = "Import thành công" });

            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi import: {ex.Message}");
            }
        }

        private int GetNextCustomerNumber()
        {
            var last = _context.KhachHangs
                .OrderByDescending(x => x.MaKhachHang)
                .FirstOrDefault();

            if (last != null && last.MaKhachHang.StartsWith("KH") &&
                int.TryParse(last.MaKhachHang.Substring(2), out int lastNum))
            {
                return lastNum + 1;
            }

            return 1;
        }


    }
}
