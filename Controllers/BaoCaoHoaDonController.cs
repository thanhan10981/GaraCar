using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaraCarAPI.Models;
using GARA.DTOs;
using System.Linq;
using System.Collections.Generic;
using System;
using Humanizer;
using ClosedXML.Excel;


namespace GARA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaoCaoHoaDonController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public BaoCaoHoaDonController(GaraCarContext context)
        {
            _context = context;
        }

        [HttpGet("hoa-don-tong-hop")]
        public async Task<ActionResult<IEnumerable<BaoCaoHoaDon>>> GetTongHopHoaDon(
            [FromQuery] DateTime? ngay,
            [FromQuery] DateTime? tuNgay,
            [FromQuery] DateTime? denNgay,                     // lọc theo khoảng ngày: đến ngày
            [FromQuery] string? tuGio,                         // lọc theo giờ bắt đầu
            [FromQuery] string? denGio,                        // lọc theo giờ kết thúc
            [FromQuery] string? loai,                          // lọc loại hóa đơn: "bán hàng", "sửa chữa"
            [FromQuery] string? khachHang,                    // lọc theo tên khách hàng
            [FromQuery] string? nhanVien,                     // lọc theo tên nhân viên
            [FromQuery] string? nguoiTao,                     // chỉ chọn nhân viên có chức vụ quản lý để hiển thị tên trên giao diện báo cáo
            [FromQuery] string? phuongThucThanhToan
        )
        {
            var hoaDonsQuery = _context.HoaDons.Include(h => h.KhachHang).AsQueryable();
            var hoaDonSuaQuery = _context.HoaDonSuaChuas
                .Include(h => h.YeuCauSuaChua)
                    .ThenInclude(y => y.XeKhachHang)
                        .ThenInclude(x => x.KhachHang)
                .Include(h => h.NhanVien)
                .AsQueryable();
            DateTime? fromDateTime = null;
            DateTime? toDateTime = null;

            if (ngay.HasValue)
            {
                var baseDay = ngay.Value.Date.AddDays(1); // ép lên 1 ngày

                var fromTime = string.IsNullOrEmpty(tuGio) ? TimeSpan.Zero : TimeSpan.Parse(tuGio);
                var toTime = string.IsNullOrEmpty(denGio) ? new TimeSpan(23, 59, 59) : TimeSpan.Parse(denGio);

                fromDateTime = baseDay.Add(fromTime);
                toDateTime = baseDay.Add(toTime);

                // 👉 FIX: Nếu toTime = 00:00 thì Add 1 ngày để không bị loại ra
                if (toTime == TimeSpan.Zero)
                {
                    toDateTime = toDateTime.Value.AddDays(1).AddTicks(-1);
                }
            }

            else if (tuNgay.HasValue && denNgay.HasValue)
            {
                var baseFrom = tuNgay.Value.Date;
                var baseTo = denNgay.Value.Date;

                var fromTime = string.IsNullOrEmpty(tuGio) ? TimeSpan.Zero : TimeSpan.Parse(tuGio);
                var toTime = string.IsNullOrEmpty(denGio) ? new TimeSpan(23, 59, 59) : TimeSpan.Parse(denGio);

                fromDateTime = baseFrom.Add(fromTime);
                toDateTime = baseTo.Add(toTime);

                // 👉 FIX: Nếu toTime là 00:00 thì cộng thêm 1 ngày để đảm bảo bao trọn ngày cuối
                if (toTime == TimeSpan.Zero)
                {
                    toDateTime = toDateTime.Value.AddDays(1).AddTicks(-1);
                }
            }


            // Nếu đã có fromDateTime và toDateTime, áp dụng lọc
            if (fromDateTime.HasValue && toDateTime.HasValue)
            {
                hoaDonsQuery = hoaDonsQuery.Where(h => h.ThoiGian >= fromDateTime && h.ThoiGian <= toDateTime);
                hoaDonSuaQuery = hoaDonSuaQuery.Where(h => h.NgayLap >= fromDateTime && h.NgayLap <= toDateTime);
            }
            // Lọc loại hóa đơn nếu được chỉ định
            if (!string.IsNullOrEmpty(loai))
            {
                loai = loai.ToLower();
                if (loai == "bán hàng") hoaDonSuaQuery = hoaDonSuaQuery.Take(0);
                else if (loai == "sửa chữa") hoaDonsQuery = hoaDonsQuery.Take(0);
            }


            // Lọc theo từ khóa tên khách hàng
            if (!string.IsNullOrEmpty(khachHang))
            {
                var keyword = khachHang.ToLower();
                hoaDonsQuery = hoaDonsQuery.Where(h => h.KhachHang.TenKhachHang.ToLower().Contains(keyword));
                hoaDonSuaQuery = hoaDonSuaQuery.Where(h => h.YeuCauSuaChua.XeKhachHang.KhachHang.TenKhachHang.ToLower().Contains(keyword));
            }

            // Lọc theo tên nhân viên
            if (!string.IsNullOrEmpty(nhanVien))
            {
                hoaDonsQuery = hoaDonsQuery.Where(h => h.NguoiBan.ToLower().Contains(nhanVien.ToLower()));
                hoaDonSuaQuery = hoaDonSuaQuery.Where(h => h.NhanVien.MaNhanVien.ToLower().Contains(nhanVien.ToLower())); 
            }
            

            // Gợi ý cho giao diện: nếu có giá trị "nguoiTao" thì chỉ lọc những hóa đơn sửa chữa có người tạo là quản lý và trùng tên
            if (!string.IsNullOrEmpty(nguoiTao))
            {
                hoaDonSuaQuery = hoaDonSuaQuery.Where(h => h.NhanVien.ChucVu == "Quản lý" && h.NhanVien.TenNhanVien.ToLower().Contains(nguoiTao.ToLower()));
            }
            //lọc phương thức thanh toán 
            if (!string.IsNullOrEmpty(phuongThucThanhToan))
            {
                hoaDonsQuery = hoaDonsQuery.Where(h => h.PhuongThucThanhToan == phuongThucThanhToan);
                hoaDonSuaQuery = hoaDonSuaQuery.Where(h => h.PhuongThucThanhToan == phuongThucThanhToan);
            }

            // Dựng danh sách hóa đơn bán hàng
            var hoaDons = await hoaDonsQuery.Select(h => new BaoCaoHoaDon
            {
                Loai = "Bán hàng",
                MaHoaDon = h.MaHoaDon,
                ThoiGian = h.ThoiGian,
                KhachHang = h.KhachHang.TenKhachHang,
                NhanVien = h.NguoiBan,
                TongTien = h.TongTien,
                TrangThai = h.TrangThai,
                PhuongThucThanhToan = h.PhuongThucThanhToan
            }).ToListAsync();

            // Dựng danh sách hóa đơn sửa chữa
            var hoaDonSua = await hoaDonSuaQuery.Select(h => new BaoCaoHoaDon
            {
                Loai = "Sửa chữa",
                MaHoaDon = h.MaHoaDon,
                ThoiGian = h.NgayLap,
                KhachHang = h.YeuCauSuaChua.XeKhachHang.KhachHang.TenKhachHang,
                NhanVien = h.NhanVien.TenNhanVien,
                TongTien = h.TongTien,
                TrangThai = h.TrangThai,
                PhuongThucThanhToan = h.PhuongThucThanhToan
            }).ToListAsync();

            // Gộp và sắp xếp kết quả
            var result = hoaDons.Concat(hoaDonSua)
                                 .OrderByDescending(x => x.ThoiGian)
                                 .ToList();
            // ✅ Tính tổng
            var tongSoHoaDon = result.Count;
            var tongTienTatCa = result.Sum(x => x.TongTien);

            return Ok(new
            {
                TongSoHoaDon = tongSoHoaDon,
                TongTienTatCa = tongTienTatCa,
                HoaDons = result
            });

            return Ok(result);
        }

        // Các hàm chi tiết hóa đơn và doanh thu giữ nguyên...

        [HttpGet("chi-tiet-ban-hang/{maHoaDon}")]
        public async Task<ActionResult<CTHDBanHangDTO>> GetChiTietBanHang(string maHoaDon)
        {
            var hoaDon = await _context.HoaDons
                .Include(h => h.KhachHang)
                .Include(h => h.SanPhamHoaDons)
                   .ThenInclude(sp => sp.SanPham)
                .FirstOrDefaultAsync(h => h.MaHoaDon == maHoaDon);

            if (hoaDon == null) return NotFound();

            var dto = new CTHDBanHangDTO
            {
                MaHoaDon = hoaDon.MaHoaDon,
                ThoiGian = hoaDon.ThoiGian,
                TenKhachHang = hoaDon.KhachHang?.TenKhachHang,
                SoDienThoai = hoaDon.KhachHang?.SoDienThoai,
                Email = hoaDon.KhachHang?.Email,
                SanPham = hoaDon.SanPhamHoaDons.Select(sp => new SanPhamDTO
                {
                    TenSanPham = sp.SanPham?.TenSanPham,
                    DonGia = sp.DonGia,
                    SoLuong = sp.SoLuong
                }).ToList()
            };

            return Ok(dto);
        }


        [HttpGet("chi-tiet-sua-chua/{maHoaDon}")]
        public async Task<ActionResult<CTHDSuaChuaDTO>> GetChiTietSuaChua(string maHoaDon)
        {
            var hoaDon = await _context.HoaDonSuaChuas
                .Include(h => h.YeuCauSuaChua)
                    .ThenInclude(y => y.XeKhachHang)
                        .ThenInclude(x => x.KhachHang)
                .Include(h => h.NhanVien)
                .Include(h => h.ChiTietDichVus)
                    .ThenInclude(ct => ct.DichVu)
                .Include(h => h.ChiTietPhuTungs)
                    .ThenInclude(pt => pt.SanPham)
                .FirstOrDefaultAsync(h => h.MaHoaDon == maHoaDon);

            if (hoaDon == null) return NotFound();

            var dto = new CTHDSuaChuaDTO
            {
                MaHoaDon = hoaDon.MaHoaDon,
                NgayLap = hoaDon.NgayLap,
                TenKhachHang = hoaDon.YeuCauSuaChua?.XeKhachHang?.KhachHang?.TenKhachHang,
                BienSo = hoaDon.YeuCauSuaChua?.XeKhachHang?.BienSoXe,
                TenNhanVien = hoaDon.NhanVien?.TenNhanVien,
                ChiTietDichVus = hoaDon.ChiTietDichVus?.Select(ct => new DichVuDTO
                {
                    TenDichVu = ct.DichVu?.TenDichVu,
                    DonGia = ct.DonGia
                }).ToList(),
                ChiTietPhuTungs = hoaDon.ChiTietPhuTungs?.Select(pt => new PhuTungDTO
                {
                    TenSanPham = pt.SanPham?.TenSanPham,
                    DonGia = pt.DonGia,
                    SoLuong = pt.SoLuong
                }).ToList()

            };

            return Ok(dto);
        }

        [HttpGet("thu-chi-tong-hop")]
        public async Task<IActionResult> GetThuChiTongHop(
    [FromQuery] DateTime? ngay,
    [FromQuery] DateTime? tuNgay,
    [FromQuery] DateTime? denNgay,
    [FromQuery] string? tuGio,
    [FromQuery] string? denGio,
    [FromQuery] string? loaiThuChi,
    [FromQuery] string? nhanVien,
    [FromQuery] string? phuongThucThanhToan // ✅ Thêm lọc phương thức
)
        {
            var query = _context.SoQuys.AsQueryable();

            // Xử lý thời gian lọc
            DateTime? fromDateTime = null;
            DateTime? toDateTime = null;

            if (ngay.HasValue)
            {
                var baseDay = ngay.Value.Date;
                var fromTime = string.IsNullOrEmpty(tuGio) ? TimeSpan.Zero : TimeSpan.Parse(tuGio);
                var toTime = string.IsNullOrEmpty(denGio) ? new TimeSpan(23, 59, 59) : TimeSpan.Parse(denGio);
                fromDateTime = baseDay.Add(fromTime);
                toDateTime = baseDay.Add(toTime);
            }
            else if (tuNgay.HasValue && denNgay.HasValue)
            {
                var baseFrom = tuNgay.Value.Date;
                var baseTo = denNgay.Value.Date;
                var fromTime = string.IsNullOrEmpty(tuGio) ? TimeSpan.Zero : TimeSpan.Parse(tuGio);
                var toTime = string.IsNullOrEmpty(denGio) ? new TimeSpan(23, 59, 59) : TimeSpan.Parse(denGio);
                fromDateTime = baseFrom.Add(fromTime);
                toDateTime = baseTo.Add(toTime);
            }

            // Lọc thời gian
            if (fromDateTime.HasValue && toDateTime.HasValue)
            {
                query = query.Where(p => p.ThoiGian >= fromDateTime && p.ThoiGian <= toDateTime);
            }

            // Lọc theo loại thu chi
            if (!string.IsNullOrEmpty(loaiThuChi))
            {
                query = query.Where(p => p.LoaiThuChi.ToLower().Contains(loaiThuChi.ToLower()));
            }

            // Lọc theo nhân viên
            if (!string.IsNullOrEmpty(nhanVien))
            {
                query = query.Where(p => p.NhanVien.ToLower().Contains(nhanVien.ToLower()));
            }

            // ✅ Lọc theo phương thức thanh toán
            if (!string.IsNullOrEmpty(phuongThucThanhToan))
            {
                query = query.Where(p => p.PhuongThucThanhToan.ToLower().Contains(phuongThucThanhToan.ToLower()));
            }

            // Truy vấn kết quả
            var result = await query.Select(p => new BaoCaoThuChiDTO
            {
                MaPhieu = p.MaPhieu,
                ThoiGian = p.ThoiGian,
                LoaiThuChi = p.LoaiThuChi,
                GiaTri = p.GiaTri,
                NguoiNhan = p.NguoiNhan,
                NhanVien = p.NhanVien,
                GhiChu = p.GhiChu,
                PhuongThucThanhToan = p.PhuongThucThanhToan  // ✅ Thêm trả về
            }).ToListAsync();

            var tong = result.Sum(p => p.GiaTri);
            // Tính tổng số phiếu và tiền cho Thu và Chi
            var soPhieuThu = result.Count(p => p.LoaiThuChi.Equals("Thu", StringComparison.OrdinalIgnoreCase));
            var soPhieuChi = result.Count(p => p.LoaiThuChi.Equals("Chi", StringComparison.OrdinalIgnoreCase));

            var tongTienThu = result.Where(p => p.LoaiThuChi.Equals("Thu", StringComparison.OrdinalIgnoreCase)).Sum(p => p.GiaTri);
            var tongTienChi = result.Where(p => p.LoaiThuChi.Equals("Chi", StringComparison.OrdinalIgnoreCase)).Sum(p => p.GiaTri);



            return Ok(new
            {
                TongSoPhieu = result.Count,
                TongTien = tong,
                SoPhieuThu = soPhieuThu,
                SoPhieuChi = soPhieuChi,
                TongTienThu = tongTienThu,
                TongTienChi = tongTienChi,
                DanhSach = result
            });

        }


        [HttpGet("doanh-thu-phu-tung")]
        public async Task<ActionResult<IEnumerable<DoanhThuPhuTungDTO>>> GetDoanhThuPhuTung(
    [FromQuery] string? thoiGian,
    [FromQuery] DateTime? tuNgay,
    [FromQuery] DateTime? denNgay,
    [FromQuery] string? phuongThucThanhToan,
    [FromQuery] string? kieuBanHang)
        {
            try
            {
                var query = _context.HoaDons
                    .Include(h => h.SanPhamHoaDons)
                    .AsQueryable();

                DateTime today = DateTime.Today;
                DateTime? fromDateTime = null;
                DateTime? toDateTime = null;

                // Bước 1: Xử lý thời gian lọc
                if (!string.IsNullOrEmpty(thoiGian))
                {
                    switch (thoiGian)
                    {
                        case "Hôm nay":
                            fromDateTime = today;
                            toDateTime = today.AddDays(1).AddTicks(-1);
                            break;
                        case "Hôm qua":
                            var yesterday = today.AddDays(-1);
                            fromDateTime = yesterday;
                            toDateTime = yesterday.AddDays(1).AddTicks(-1);
                            break;
                        case "7 ngày qua":
                            fromDateTime = today.AddDays(-6);
                            toDateTime = today.AddDays(1).AddTicks(-1);
                            break;
                        case "Tuần này":
                            var monday = today.AddDays(-(int)today.DayOfWeek + (today.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));
                            fromDateTime = monday;
                            toDateTime = monday.AddDays(7).AddTicks(-1);
                            break;
                        case "Tuần trước":
                            var lastMonday = today.AddDays(-(int)today.DayOfWeek - 6);
                            fromDateTime = lastMonday;
                            toDateTime = lastMonday.AddDays(7).AddTicks(-1);
                            break;
                        case "Tháng này":
                            fromDateTime = new DateTime(today.Year, today.Month, 1);
                            toDateTime = fromDateTime.Value.AddMonths(1).AddTicks(-1);
                            break;
                        case "Tháng trước":
                            fromDateTime = new DateTime(today.Year, today.Month, 1).AddMonths(-1);
                            toDateTime = fromDateTime.Value.AddMonths(1).AddTicks(-1);
                            break;
                        case "30 ngày qua":
                            fromDateTime = today.AddDays(-29);
                            toDateTime = today.AddDays(1).AddTicks(-1);
                            break;
                        case "Quý này":
                            int quarter = (today.Month - 1) / 3 + 1;
                            fromDateTime = new DateTime(today.Year, (quarter - 1) * 3 + 1, 1);
                            toDateTime = fromDateTime.Value.AddMonths(3).AddTicks(-1);
                            break;
                        case "Quý trước":
                            int prevQuarter = ((today.Month - 1) / 3);
                            fromDateTime = prevQuarter == 0
                                ? new DateTime(today.Year - 1, 10, 1)
                                : new DateTime(today.Year, (prevQuarter - 1) * 3 + 1, 1);
                            toDateTime = fromDateTime.Value.AddMonths(3).AddTicks(-1);
                            break;
                        case "Năm nay":
                            fromDateTime = new DateTime(today.Year, 1, 1);
                            toDateTime = new DateTime(today.Year + 1, 1, 1).AddTicks(-1);
                            break;
                        case "Năm trước":
                            fromDateTime = new DateTime(today.Year - 1, 1, 1);
                            toDateTime = new DateTime(today.Year, 1, 1).AddTicks(-1);
                            break;
                    }
                }
                else if (tuNgay.HasValue && denNgay.HasValue)
                {
                    fromDateTime = tuNgay.Value.Date;
                    toDateTime = denNgay.Value.Date.AddDays(1).AddTicks(-1);
                }

                // Bước 2: Lọc theo thời gian
                if (fromDateTime.HasValue && toDateTime.HasValue)
                {
                    query = query.Where(h => h.ThoiGian >= fromDateTime && h.ThoiGian <= toDateTime);
                }

                // Bước 3: Lọc phương thức thanh toán
                if (!string.IsNullOrEmpty(phuongThucThanhToan))
                {
                    query = query.Where(h => h.PhuongThucThanhToan == phuongThucThanhToan);
                }

                // Bước 4: Lọc kiểu bán hàng
                if (!string.IsNullOrEmpty(kieuBanHang))
                {
                    query = query.Where(h => h.KieuBanHang == kieuBanHang);
                }

                // Bước 5: Tính toán doanh thu
                 var result = query
                 .Where(h => h.SanPhamHoaDons != null && h.SanPhamHoaDons.Any())
                 .SelectMany(h => h.SanPhamHoaDons.Select(sp => new
                 {
                     Ngay = h.ThoiGian.Date,
                     DoanhThu = sp.DonGia * Convert.ToDecimal(sp.SoLuong)
                 }))
                 .GroupBy(x => x.Ngay)
                 .AsEnumerable()
                 .Select(g => new DoanhThuPhuTungDTO
                 {
                     Ngay = g.Key.ToString("dd/MM"),
                     TongTien = g.Sum(x => x.DoanhThu)
                 })
                 .OrderBy(x => x.Ngay)
                 .ToList(); // ✅ KHÔNG dùng await ở đây

                return Ok(result);


            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message} - {ex.InnerException?.Message}");
            }
        }

        [HttpGet("loi-nhuan-phu-tung")]
        public async Task<ActionResult<IEnumerable<LoiNhuanPhuTungDTO>>> GetLoiNhuanPhuTung(
        [FromQuery] string? thoiGian,
        [FromQuery] DateTime? tuNgay,
        [FromQuery] DateTime? denNgay,
        [FromQuery] string? phuongThucThanhToan,
        [FromQuery] string? kieuBanHang)
        {
            try
            {
                var query = _context.HoaDons
                    .Include(h => h.SanPhamHoaDons)
                        .ThenInclude(sp => sp.SanPham)
                    .AsQueryable();

                DateTime today = DateTime.Today;
                DateTime? fromDateTime = null;
                DateTime? toDateTime = null;

                if (!string.IsNullOrEmpty(thoiGian))
                {
                    switch (thoiGian)
                    {
                        case "Hôm nay":
                            fromDateTime = today;
                            toDateTime = today.AddDays(1).AddTicks(-1);
                            break;
                        case "Hôm qua":
                            var yesterday = today.AddDays(-1);
                            fromDateTime = yesterday;
                            toDateTime = yesterday.AddDays(1).AddTicks(-1);
                            break;
                        case "7 ngày qua":
                            fromDateTime = today.AddDays(-6);
                            toDateTime = today.AddDays(1).AddTicks(-1);
                            break;
                        case "Tuần này":
                            var monday = today.AddDays(-(int)today.DayOfWeek + (today.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));
                            fromDateTime = monday;
                            toDateTime = monday.AddDays(7).AddTicks(-1);
                            break;
                        case "Tuần trước":
                            var lastMonday = today.AddDays(-(int)today.DayOfWeek - 6);
                            fromDateTime = lastMonday;
                            toDateTime = lastMonday.AddDays(7).AddTicks(-1);
                            break;
                        case "Tháng này":
                            fromDateTime = new DateTime(today.Year, today.Month, 1);
                            toDateTime = fromDateTime.Value.AddMonths(1).AddTicks(-1);
                            break;
                        case "Tháng trước":
                            fromDateTime = new DateTime(today.Year, today.Month, 1).AddMonths(-1);
                            toDateTime = fromDateTime.Value.AddMonths(1).AddTicks(-1);
                            break;
                        case "30 ngày qua":
                            fromDateTime = today.AddDays(-29);
                            toDateTime = today.AddDays(1).AddTicks(-1);
                            break;
                        case "Quý này":
                            int quarter = (today.Month - 1) / 3 + 1;
                            fromDateTime = new DateTime(today.Year, (quarter - 1) * 3 + 1, 1);
                            toDateTime = fromDateTime.Value.AddMonths(3).AddTicks(-1);
                            break;
                        case "Quý trước":
                            int prevQuarter = ((today.Month - 1) / 3);
                            fromDateTime = prevQuarter == 0
                                ? new DateTime(today.Year - 1, 10, 1)
                                : new DateTime(today.Year, (prevQuarter - 1) * 3 + 1, 1);
                            toDateTime = fromDateTime.Value.AddMonths(3).AddTicks(-1);
                            break;
                        case "Năm nay":
                            fromDateTime = new DateTime(today.Year, 1, 1);
                            toDateTime = new DateTime(today.Year + 1, 1, 1).AddTicks(-1);
                            break;
                        case "Năm trước":
                            fromDateTime = new DateTime(today.Year - 1, 1, 1);
                            toDateTime = new DateTime(today.Year, 1, 1).AddTicks(-1);
                            break;
                    }
                }
                else if (tuNgay.HasValue && denNgay.HasValue)
                {
                    fromDateTime = tuNgay.Value.Date;
                    toDateTime = denNgay.Value.Date.AddDays(1).AddTicks(-1);
                }

                if (fromDateTime.HasValue && toDateTime.HasValue)
                {
                    query = query.Where(h => h.ThoiGian >= fromDateTime && h.ThoiGian <= toDateTime);
                }

                if (!string.IsNullOrEmpty(phuongThucThanhToan))
                {
                    query = query.Where(h => h.PhuongThucThanhToan == phuongThucThanhToan);
                }

                if (!string.IsNullOrEmpty(kieuBanHang))
                {
                    query = query.Where(h => h.KieuBanHang == kieuBanHang);
                }
                // Tính lợi nhuận
                var result = query
                    .Where(h => h.SanPhamHoaDons != null && h.SanPhamHoaDons.Any())
                    .SelectMany(h => h.SanPhamHoaDons.Select(sp => new
                    {
                        Ngay = h.ThoiGian.Date,
                        LoiNhuan = (((sp.DonGia ) - (sp.SanPham.GiaVon)) * (sp.SoLuong)) + (h.PhuThu)

                    }))
                    .GroupBy(x => x.Ngay)
                    .AsEnumerable()
                    .Select(g => new LoiNhuanPhuTungDTO
                    {
                        Ngay = g.Key.ToString("dd/MM"),
                        LoiNhuan = g.Sum(x => x.LoiNhuan)
                    })
                    .OrderBy(x => x.Ngay)
                    .ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message} - {ex.InnerException?.Message}");
            }
        }

        [HttpGet("bao-cao/doanh-thu-loi-nhuan")]
        public async Task<ActionResult<IEnumerable<DoanhThuLoiNhuanDTO>>> GetBaoCaoDoanhThuLoiNhuan(
        [FromQuery] string? thoiGian,
        [FromQuery] DateTime? tuNgay,
        [FromQuery] DateTime? denNgay,
        [FromQuery] string? phuongThucThanhToan,
        [FromQuery] string? kieuBanHang,
        [FromQuery] string? sortBy,
        [FromQuery] string? sortOrder)
        {
            try
            {
                var query = _context.HoaDons
                    .Include(h => h.SanPhamHoaDons)
                        .ThenInclude(sp => sp.SanPham)
                    .AsQueryable();

                // ✅ Xử lý thời gian lọc
                DateTime today = DateTime.Today;
                DateTime? fromDateTime = null, toDateTime = null;

                if (!string.IsNullOrEmpty(thoiGian))
                {
                    switch (thoiGian)
                    {
                        case "Hôm nay":
                            fromDateTime = today;
                            toDateTime = today.AddDays(1).AddTicks(-1);
                            break;
                        case "Hôm qua":
                            var yesterday = today.AddDays(-1);
                            fromDateTime = yesterday;
                            toDateTime = yesterday.AddDays(1).AddTicks(-1);
                            break;
                        case "7 ngày qua":
                            fromDateTime = today.AddDays(-6);
                            toDateTime = today.AddDays(1).AddTicks(-1);
                            break;
                        case "Tuần này":
                            var monday = today.AddDays(-(int)today.DayOfWeek + (today.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));
                            fromDateTime = monday;
                            toDateTime = monday.AddDays(7).AddTicks(-1);
                            break;
                        case "Tuần trước":
                            var lastMonday = today.AddDays(-(int)today.DayOfWeek - 6);
                            fromDateTime = lastMonday;
                            toDateTime = lastMonday.AddDays(7).AddTicks(-1);
                            break;
                        case "Tháng này":
                            fromDateTime = new DateTime(today.Year, today.Month, 1);
                            toDateTime = fromDateTime.Value.AddMonths(1).AddTicks(-1);
                            break;
                        case "Tháng trước":
                            fromDateTime = new DateTime(today.Year, today.Month, 1).AddMonths(-1);
                            toDateTime = fromDateTime.Value.AddMonths(1).AddTicks(-1);
                            break;
                        case "30 ngày qua":
                            fromDateTime = today.AddDays(-29);
                            toDateTime = today.AddDays(1).AddTicks(-1);
                            break;
                        case "Quý này":
                            int quarter = (today.Month - 1) / 3 + 1;
                            fromDateTime = new DateTime(today.Year, (quarter - 1) * 3 + 1, 1);
                            toDateTime = fromDateTime.Value.AddMonths(3).AddTicks(-1);
                            break;
                        case "Quý trước":
                            int prevQuarter = ((today.Month - 1) / 3);
                            fromDateTime = prevQuarter == 0
                                ? new DateTime(today.Year - 1, 10, 1)
                                : new DateTime(today.Year, (prevQuarter - 1) * 3 + 1, 1);
                            toDateTime = fromDateTime.Value.AddMonths(3).AddTicks(-1);
                            break;
                        case "Năm nay":
                            fromDateTime = new DateTime(today.Year, 1, 1);
                            toDateTime = new DateTime(today.Year + 1, 1, 1).AddTicks(-1);
                            break;
                        case "Năm trước":
                            fromDateTime = new DateTime(today.Year - 1, 1, 1);
                            toDateTime = new DateTime(today.Year, 1, 1).AddTicks(-1);
                            break;
                    }
                }
                else if (tuNgay.HasValue && denNgay.HasValue)
                {
                    fromDateTime = tuNgay.Value.Date;
                    toDateTime = denNgay.Value.Date.AddDays(1).AddTicks(-1);
                }

                // ✅ Áp dụng bộ lọc thời gian
                if (fromDateTime.HasValue && toDateTime.HasValue)
                {
                    query = query.Where(h => h.ThoiGian >= fromDateTime && h.ThoiGian <= toDateTime);
                }

                // ✅ Bộ lọc phương thức thanh toán
                if (!string.IsNullOrEmpty(phuongThucThanhToan))
                {
                    query = query.Where(h => h.PhuongThucThanhToan == phuongThucThanhToan);
                }

                // ✅ Bộ lọc kiểu bán hàng
                if (!string.IsNullOrEmpty(kieuBanHang))
                {
                    query = query.Where(h => h.KieuBanHang == kieuBanHang);
                }

                // ✅ Tính toán dữ liệu
                var result = query
                    .Where(h => h.SanPhamHoaDons.Any())
                    .AsEnumerable()
                    .GroupBy(h => h.ThoiGian.Date)
                    .Select(g => new DoanhThuLoiNhuanDTO
                    {
                        Ngay = g.Key.ToString("yyyy-MM-dd"),
                        SoLuongDon = g.Count(),
                        DoanhThu = g.Sum(h => h.SanPhamHoaDons.Sum(sp => sp.DonGia * sp.SoLuong)),
                        GiaVon = g.Sum(h => h.SanPhamHoaDons.Sum(sp => (sp.SanPham?.GiaVon ?? 0) * sp.SoLuong)),
                        PhuThu = g.Sum(h => h.PhuThu)
                    })
                    .ToList();
                // ✅ Sắp xếp kết quả theo yêu cầu
                if (!string.IsNullOrEmpty(sortBy))
                {
                    bool desc = sortOrder?.ToLower() == "desc";
                    result = sortBy.ToLower() switch
                    {
                        "doanhthu" => desc ? result.OrderByDescending(x => x.DoanhThu).ToList()
                                           : result.OrderBy(x => x.DoanhThu).ToList(),
                        "loinhuan" => desc ? result.OrderByDescending(x => (x.DoanhThu - x.GiaVon + x.PhuThu)).ToList()
                                           : result.OrderBy(x => (x.DoanhThu - x.GiaVon + x.PhuThu)).ToList(),
                        "giavon" => desc ? result.OrderByDescending(x => x.GiaVon).ToList()
                                           : result.OrderBy(x => x.GiaVon).ToList(),
                        _ => result.OrderBy(x => x.Ngay).ToList()
                    };
                }
                var response = new DoanhThuLoiNhuanResponse
                {
                    Data = result, // <--- dùng result đã sắp xếp
                    TongSoLuongDon = result.Sum(x => x.SoLuongDon),
                    TongGiaVon = result.Sum(x => x.GiaVon),
                    TongDoanhThu = result.Sum(x => x.DoanhThu),
                    TongPhuThu = result.Sum(x => x.PhuThu),
                    TongLoiNhuan = result.Sum(x => x.DoanhThu - x.GiaVon + x.PhuThu)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message} - {ex.InnerException?.Message}");
            }
        }

        [HttpGet("bao-cao/Chi-Tiet-Theo-Ngay")]
        public async Task<ActionResult<IEnumerable<SanPhamChiTietDTO>>> GetChiTietTheoNgay(
     [FromQuery] DateTime tuNgay,
     [FromQuery] DateTime denNgay)
        {
            try
            {
                var hoaDonTrongNgay = await _context.HoaDons
                    .Include(h => h.SanPhamHoaDons)
                        .ThenInclude(sp => sp.SanPham)
                   .Where(h => h.ThoiGian >= tuNgay && h.ThoiGian <= denNgay)
                    .ToListAsync();

                var chiTiet = hoaDonTrongNgay
                    .SelectMany(h => h.SanPhamHoaDons.Select(sp => new SanPhamChiTietDTO
                    {
                        TenSanPham = sp.SanPham.TenSanPham,
                        SoLuong = sp.SoLuong,
                        DonGia = sp.DonGia,
                        GiaVon = sp.SanPham.GiaVon,
                        ThanhTien = sp.SoLuong * sp.DonGia,
                        LoiNhuan = (sp.DonGia - sp.SanPham.GiaVon) * sp.SoLuong + h.PhuThu
                    }))
                    .ToList();

                return Ok(chiTiet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message} - {ex.InnerException?.Message}");
            }
        }
        [HttpGet("nhan-vien/bao-cao")]
        public async Task<IActionResult> BaoCaoNhanVien(
    [FromQuery] string? maNhanVien,
    [FromQuery] string? thoiGian,
    [FromQuery] DateTime? tuNgay,
    [FromQuery] DateTime? denNgay,
    [FromQuery] string? phuongThucThanhToan,
    [FromQuery] string? kieuBanHang,
    [FromQuery] string? sortBy,
    [FromQuery] string? sortOrder
)
        {
            var query = _context.HoaDons
                .Include(h => h.NhanVien)
                .Include(h => h.SanPhamHoaDons)
                .AsQueryable();

            DateTime today = DateTime.Today;
            DateTime? fromDateTime = null, toDateTime = null;

            if (!string.IsNullOrEmpty(thoiGian))
            {
                switch (thoiGian)
                {
                    case "Hôm nay":
                        fromDateTime = today;
                        toDateTime = today.AddDays(1).AddTicks(-1);
                        break;
                    case "Hôm qua":
                        var yesterday = today.AddDays(-1);
                        fromDateTime = yesterday;
                        toDateTime = yesterday.AddDays(1).AddTicks(-1);
                        break;
                    case "7 ngày qua":
                        fromDateTime = today.AddDays(-6);
                        toDateTime = today.AddDays(1).AddTicks(-1);
                        break;
                    case "Tuần này":
                        var monday = today.AddDays(-(int)today.DayOfWeek + (today.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));
                        fromDateTime = monday;
                        toDateTime = monday.AddDays(7).AddTicks(-1);
                        break;
                    case "Tuần trước":
                        var lastMonday = today.AddDays(-(int)today.DayOfWeek - 6);
                        fromDateTime = lastMonday;
                        toDateTime = lastMonday.AddDays(7).AddTicks(-1);
                        break;
                    case "Tháng này":
                        fromDateTime = new DateTime(today.Year, today.Month, 1);
                        toDateTime = fromDateTime.Value.AddMonths(1).AddTicks(-1);
                        break;
                    case "Tháng trước":
                        fromDateTime = new DateTime(today.Year, today.Month, 1).AddMonths(-1);
                        toDateTime = fromDateTime.Value.AddMonths(1).AddTicks(-1);
                        break;
                    case "30 ngày qua":
                        fromDateTime = today.AddDays(-29);
                        toDateTime = today.AddDays(1).AddTicks(-1);
                        break;
                    case "Quý này":
                        int quarter = (today.Month - 1) / 3 + 1;
                        fromDateTime = new DateTime(today.Year, (quarter - 1) * 3 + 1, 1);
                        toDateTime = fromDateTime.Value.AddMonths(3).AddTicks(-1);
                        break;
                    case "Quý trước":
                        int prevQuarter = ((today.Month - 1) / 3);
                        fromDateTime = prevQuarter == 0
                            ? new DateTime(today.Year - 1, 10, 1)
                            : new DateTime(today.Year, (prevQuarter - 1) * 3 + 1, 1);
                        toDateTime = fromDateTime.Value.AddMonths(3).AddTicks(-1);
                        break;
                    case "Năm nay":
                        fromDateTime = new DateTime(today.Year, 1, 1);
                        toDateTime = new DateTime(today.Year + 1, 1, 1).AddTicks(-1);
                        break;
                    case "Năm trước":
                        fromDateTime = new DateTime(today.Year - 1, 1, 1);
                        toDateTime = new DateTime(today.Year, 1, 1).AddTicks(-1);
                        break;
                }
            }

            if (fromDateTime.HasValue)
                query = query.Where(h => h.ThoiGian >= fromDateTime.Value);
            if (toDateTime.HasValue)
                query = query.Where(h => h.ThoiGian <= toDateTime.Value);
            if (tuNgay.HasValue)
                query = query.Where(h => h.ThoiGian >= tuNgay.Value);
            if (denNgay.HasValue)
                query = query.Where(h => h.ThoiGian <= denNgay.Value);

            if (!string.IsNullOrEmpty(phuongThucThanhToan))
                query = query.Where(h => h.PhuongThucThanhToan == phuongThucThanhToan);
            if (!string.IsNullOrEmpty(kieuBanHang))
                query = query.Where(h => h.KieuBanHang == kieuBanHang);

            // ✅ Nếu truyền mã nhân viên
            if (!string.IsNullOrEmpty(maNhanVien))
            {
                var data = await query
                    .Where(h => h.MaNhanVien == maNhanVien)
                    .Select(h => new
                    {
                        h.TongTien,
                        h.PhuThu,
                        GiaVon = h.SanPhamHoaDons.Sum(sp => sp.SoLuong * sp.DonGia),
                        SoLuongSP = h.SanPhamHoaDons.Sum(sp => sp.SoLuong)
                    })
                    .ToListAsync();

                var result = new
                {
                    TongHoaDon = data.Count,
                    TongSanPhamBan = data.Sum(x => x.SoLuongSP),
                    TongLoiNhuan = data.Sum(x => x.TongTien - x.GiaVon + x.PhuThu)
                };

                return Ok(result);
            }
            else
            {
                // ✅ Trả về top 10 nhân viên có doanh thu cao nhất
                var resultQuery = query
                    .GroupBy(h => new { h.MaNhanVien, h.NhanVien.TenNhanVien })
                    .Select(g => new
                    {
                        MaNhanVien = g.Key.MaNhanVien,
                        TenNhanVien = g.Key.TenNhanVien,
                        TongDoanhThu = g.Sum(h => h.TongTien)
                    });

                if (sortOrder?.ToLower() == "asc")
                    resultQuery = resultQuery.OrderBy(x => x.TongDoanhThu);
                else
                    resultQuery = resultQuery.OrderByDescending(x => x.TongDoanhThu);

                var result = await resultQuery.Take(10).ToListAsync();
                return Ok(new { data = result });
            }
        }
        [HttpGet("xuat-excel")]
        public async Task<IActionResult> ExportBaoCaoExcel(
        [FromQuery] string loaiBaoCao,
        [FromQuery] string? thoiGian,
        [FromQuery] string? tuNgay,
        [FromQuery] string? denNgay,
        [FromQuery] string? phuongThucThanhToan,
        [FromQuery] string? kieuBanHang)
        {
            DateTime? from = null, to = null;
            DateTime today = DateTime.Today;

            // Nếu có thoiGian nhưng không truyền tuNgay/denNgay thì xử lý thoiGian
            if (!string.IsNullOrEmpty(thoiGian) && string.IsNullOrEmpty(tuNgay) && string.IsNullOrEmpty(denNgay))
            {
                switch (thoiGian)
                {
                    case "Hôm nay":
                        from = today;
                        to = today.AddDays(1).AddTicks(-1);
                        break;
                    case "Hôm qua":
                        var yesterday = today.AddDays(-1);
                        from = yesterday;
                        to = yesterday.AddDays(1).AddTicks(-1);
                        break;
                    case "7 ngày qua":
                        from = today.AddDays(-6);
                        to = today.AddDays(1).AddTicks(-1);
                        break;
                    case "Tuần này":
                        var monday = today.AddDays(-(int)today.DayOfWeek + (today.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));
                        from = monday;
                        to = monday.AddDays(7).AddTicks(-1);
                        break;
                    case "Tuần trước":
                        var lastMonday = today.AddDays(-(int)today.DayOfWeek - 6);
                        from = lastMonday;
                        to = lastMonday.AddDays(7).AddTicks(-1);
                        break;
                    case "Tháng này":
                        from = new DateTime(today.Year, today.Month, 1);
                        to = from.Value.AddMonths(1).AddTicks(-1);
                        break;
                    case "Tháng trước":
                        from = new DateTime(today.Year, today.Month, 1).AddMonths(-1);
                        to = from.Value.AddMonths(1).AddTicks(-1);
                        break;
                    case "Quý này":
                        int quarter = (today.Month - 1) / 3 + 1;
                        from = new DateTime(today.Year, (quarter - 1) * 3 + 1, 1);
                        to = from.Value.AddMonths(3).AddTicks(-1);
                        break;
                    case "Quý trước":
                        int prevQuarter = ((today.Month - 1) / 3);
                        from = prevQuarter == 0
                            ? new DateTime(today.Year - 1, 10, 1)
                            : new DateTime(today.Year, (prevQuarter - 1) * 3 + 1, 1);
                        to = from.Value.AddMonths(3).AddTicks(-1);
                        break;
                    case "Năm nay":
                        from = new DateTime(today.Year, 1, 1);
                        to = new DateTime(today.Year + 1, 1, 1).AddTicks(-1);
                        break;
                    case "Năm trước":
                        from = new DateTime(today.Year - 1, 1, 1);
                        to = new DateTime(today.Year, 1, 1).AddTicks(-1);
                        break;

                    // ✳️ Các case "âm lịch" bạn tự xử lý nếu cần hỗ trợ chuyển đổi lịch âm - dương
                    case "Tháng này (âm lịch)":
                    case "Tháng trước (âm lịch)":
                    case "Năm nay (âm lịch)":
                    case "Năm trước (âm lịch)":
                        return BadRequest("Chưa hỗ trợ lọc theo lịch âm");
                }

            }
            else
            {
                if (DateTime.TryParse(tuNgay, out var parsedFrom)) from = parsedFrom;
                if (DateTime.TryParse(denNgay, out var parsedTo)) to = parsedTo.AddDays(1).AddTicks(-1);
            }

            switch (loaiBaoCao)
            {
                case "Doanh thu":
                    return await ExportExcelDoanhThu(from, to, phuongThucThanhToan, kieuBanHang);
                case "Lợi nhuận":
                    return await ExportExcelLoiNhuan(from, to, phuongThucThanhToan, kieuBanHang);
                case "Nhân viên":
                    return await ExportExcelNhanVien(from, to, phuongThucThanhToan, kieuBanHang);
                default:
                    return BadRequest("Loại báo cáo không hợp lệ");
            }
        }
        private List<DoanhThuLoiNhuanDTO> TinhLoiNhuanChiTiet(DateTime? from, DateTime? to, string? phuongThuc, string? kieuBan)
        {
            var query = _context.HoaDons
                .Include(h => h.SanPhamHoaDons)
                    .ThenInclude(sp => sp.SanPham)
                .AsQueryable();

            if (from.HasValue && to.HasValue)
                query = query.Where(h => h.ThoiGian >= from && h.ThoiGian <= to);
            if (!string.IsNullOrEmpty(phuongThuc))
                query = query.Where(h => h.PhuongThucThanhToan == phuongThuc);
            if (!string.IsNullOrEmpty(kieuBan))
                query = query.Where(h => h.KieuBanHang == kieuBan);

            var result = query
                .AsEnumerable()
                .GroupBy(h => h.ThoiGian.Date)
                .Select(g => new DoanhThuLoiNhuanDTO
                {
                    Ngay = g.Key.ToString("yyyy-MM-dd"),
                    SoLuongDon = g.Count(),
                    GiaVon = g.Sum(h => h.SanPhamHoaDons.Sum(sp => sp.SanPham.GiaVon * sp.SoLuong)),
                    DoanhThu = g.Sum(h => h.SanPhamHoaDons.Sum(sp => sp.DonGia * sp.SoLuong)),
                    PhuThu = g.Sum(h => h.PhuThu),
                }).ToList();

            return result;
        }


        // Hàm xuất Excel - Lợi nhuận
        private async Task<IActionResult> ExportExcelLoiNhuan(DateTime? from, DateTime? to, string? phuongThucThanhToan, string? kieuBanHang)
        {
            var data = TinhLoiNhuanChiTiet(from, to, phuongThucThanhToan, kieuBanHang);
            if (!data.Any()) return BadRequest("Không có dữ liệu");

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Lợi nhuận phụ tùng");

            ws.Cell(1, 1).Value = "BÁO CÁO LỢI NHUẬN PHỤ TÙNG";
            ws.Range("A1:F1").Merge().Style.Font.SetBold().Font.FontSize = 14;
            ws.Cell(2, 1).Value = $"Ngày lập: {DateTime.Now:dd/MM/yyyy HH:mm}";
            ws.Range("A2:F2").Merge();

            string[] headers = { "Thời gian", "SL đơn bán", "Giá vốn", "Doanh thu", "Phụ thu", "Lợi nhuận" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(4, i + 1).Value = headers[i];
                ws.Cell(4, i + 1).Style.Font.SetBold();
                ws.Cell(4, i + 1).Style.Fill.SetBackgroundColor(XLColor.LightCyan);
            }

            int row = 5;
            foreach (var item in data)
            {
                ws.Cell(row, 1).Value = item.Ngay;
                ws.Cell(row, 2).Value = item.SoLuongDon;
                ws.Cell(row, 3).Value = item.GiaVon;
                ws.Cell(row, 4).Value = item.DoanhThu;
                ws.Cell(row, 5).Value = item.PhuThu;
                ws.Cell(row, 6).Value = item.LoiNhuan;
                row++;
            }

            // Tổng dòng
            ws.Cell(row, 1).Value = "Tổng";
            ws.Cell(row, 2).FormulaA1 = $"SUM(B5:B{row - 1})";
            ws.Cell(row, 3).FormulaA1 = $"SUM(C5:C{row - 1})";
            ws.Cell(row, 4).FormulaA1 = $"SUM(D5:D{row - 1})";
            ws.Cell(row, 5).FormulaA1 = $"SUM(E5:E{row - 1})";
            ws.Cell(row, 6).FormulaA1 = $"SUM(F5:F{row - 1})";
            ws.Row(row).Style.Font.SetBold();
            ws.Row(row).Style.Fill.SetBackgroundColor(XLColor.LightGreen);

            ws.Columns().AdjustToContents();
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"BaoCaoLoiNhuan_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }




        // Hàm xuất Excel - Nhân viên
        private async Task<IActionResult> ExportExcelNhanVien(DateTime? from, DateTime? to, string? phuongThucThanhToan, string? kieuBanHang)
        {
            var response = await BaoCaoNhanVien(null, null, from, to, phuongThucThanhToan, kieuBanHang, null, null) as OkObjectResult;

            if (response?.Value == null)
                return BadRequest("Không có dữ liệu");

            dynamic data = response.Value;
            if (data.data == null)
                return BadRequest("Không có dữ liệu");

            // dùng data bình thường
            var list = ((IEnumerable<object>)data.data).Cast<dynamic>().ToList();



            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Doanh thu nhân viên");

            ws.Cell(1, 1).Value = "BÁO CÁO NHÂN VIÊN BÁN HÀNG";
            ws.Range("A1:C1").Merge().Style.Font.SetBold().Font.FontSize = 14;
            ws.Cell(2, 1).Value = $"Ngày lập: {DateTime.Now:dd/MM/yyyy HH:mm}";
            ws.Range("A2:C2").Merge();

            string[] headers = { "Mã nhân viên", "Tên nhân viên", "Tổng doanh thu" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(4, i + 1).Value = headers[i];
                ws.Cell(4, i + 1).Style.Font.SetBold();
                ws.Cell(4, i + 1).Style.Fill.BackgroundColor = XLColor.LightGreen;
            }

            int row = 5;
            foreach (var item in list)
            {
                ws.Cell(row, 1).Value = item.MaNhanVien;
                ws.Cell(row, 2).Value = item.TenNhanVien;
                ws.Cell(row, 3).Value = item.TongDoanhThu;
                row++;
            }

            ws.Columns().AdjustToContents();
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"BaoCaoNhanVien_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }

        private async Task<IActionResult> ExportExcelDoanhThu(DateTime? from, DateTime? to, string? phuongThuc, string? kieuBan)
        {
            var query = _context.HoaDons
                .Include(h => h.SanPhamHoaDons)
                    .ThenInclude(sp => sp.SanPham)
                .AsQueryable();

            if (from.HasValue && to.HasValue)
                query = query.Where(h => h.ThoiGian >= from && h.ThoiGian <= to);

            if (!string.IsNullOrEmpty(phuongThuc))
                query = query.Where(h => h.PhuongThucThanhToan == phuongThuc);

            if (!string.IsNullOrEmpty(kieuBan))
                query = query.Where(h => h.KieuBanHang == kieuBan);

            var result = query
                .Where(h => h.SanPhamHoaDons.Any())
                .AsEnumerable()
                .GroupBy(h => h.ThoiGian.Date)
                .Select(g => new
                {
                    Ngay = g.Key.ToString("yyyy-MM-dd"),
                    SoLuongDon = g.Count(),
                    GiaVon = g.Sum(h => h.SanPhamHoaDons.Sum(sp => sp.SanPham.GiaVon * sp.SoLuong)),
                    DoanhThu = g.Sum(h => h.SanPhamHoaDons.Sum(sp => sp.DonGia * sp.SoLuong)),
                    PhuThu = g.Sum(h => h.PhuThu),
                })
                .Select(x => new
                {
                    x.Ngay,
                    x.SoLuongDon,
                    x.GiaVon,
                    x.DoanhThu,
                    x.PhuThu,
                    LoiNhuan = x.DoanhThu - x.GiaVon + x.PhuThu
                })
                .OrderBy(x => x.Ngay)
                .ToList();

            // 👉 Tổng cộng
            var tong = new
            {
                Ngay = "Tổng",
                SoLuongDon = result.Sum(x => x.SoLuongDon),
                GiaVon = result.Sum(x => x.GiaVon),
                DoanhThu = result.Sum(x => x.DoanhThu),
                PhuThu = result.Sum(x => x.PhuThu),
                LoiNhuan = result.Sum(x => x.LoiNhuan)
            };

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Báo cáo doanh thu");

            // Tiêu đề
            ws.Cell(1, 1).Value = "BÁO CÁO DOANH THU – LỢI NHUẬN";
            ws.Range("A1:F1").Merge().Style
                .Font.SetBold()
                .Font.FontSize = 14;

            ws.Cell(2, 1).Value = $"Ngày lập: {DateTime.Now:dd/MM/yyyy HH:mm}";
            ws.Range("A2:F2").Merge();

            // Header
            string[] headers = { "Thời gian", "SL đơn bán", "Giá vốn", "Doanh thu", "Phụ Thu", "Lợi Nhuận" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(4, i + 1).Value = headers[i];
                ws.Cell(4, i + 1).Style
                    .Font.SetBold()
                    .Fill.SetBackgroundColor(XLColor.LightCyan)
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
            }

            // Ghi dòng tổng
            ws.Cell(5, 1).Value = tong.Ngay;
            ws.Cell(5, 2).Value = tong.SoLuongDon;
            ws.Cell(5, 3).Value = tong.GiaVon;
            ws.Cell(5, 4).Value = tong.DoanhThu;
            ws.Cell(5, 5).Value = tong.PhuThu;
            ws.Cell(5, 6).Value = tong.LoiNhuan;

            for (int i = 1; i <= 6; i++)
            {
                ws.Cell(5, i).Style.Font.SetBold();
                ws.Cell(5, i).Style.Fill.SetBackgroundColor(XLColor.LightGreen);
            }

            // Dữ liệu từng dòng
            int row = 6;
            foreach (var r in result)
            {
                ws.Cell(row, 1).Value = r.Ngay;
                ws.Cell(row, 2).Value = r.SoLuongDon;
                ws.Cell(row, 3).Value = r.GiaVon;
                ws.Cell(row, 4).Value = r.DoanhThu;
                ws.Cell(row, 5).Value = r.PhuThu;
                ws.Cell(row, 6).Value = r.LoiNhuan;
                row++;
            }

            ws.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"BaoCaoDoanhThu_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }


    }

}

