using ClosedXML.Excel;
using GARA.DTOs;
using GaraCar.DTOs;
using GaraCarAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace GARA.Controllers
{
   
        [Route("api/bao-cao/hang-hoa")]
        [ApiController]
        public class BaoCaoHangHoaController : ControllerBase
        {
            private readonly GaraCarContext _context;

            public BaoCaoHangHoaController(GaraCarContext context)
            {
                _context = context;
            }

            [HttpGet]
            public async Task<IActionResult> GetBaoCaoHangHoa(
                [FromQuery] string kieuHienThi,
                [FromQuery] string moiQuanTam,
                [FromQuery] string? loaiBaoCao,
                [FromQuery] string? thoiGian,
                [FromQuery] string? tuNgay,
                [FromQuery] string? denNgay,
                [FromQuery] string? maLoaiHang,
                [FromQuery] string? maNhaCungCap,
                [FromQuery] int? pageNumber,
                [FromQuery] int? pageSize )
            {
                DateTime today = DateTime.Today;
                DateTime? fromDateTime = null, toDateTime = null;

            if (string.IsNullOrEmpty(tuNgay) && string.IsNullOrEmpty(denNgay) && !string.IsNullOrEmpty(thoiGian))
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

                if (!string.IsNullOrEmpty(tuNgay))
                {
                    if (DateTime.TryParseExact(tuNgay, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedFrom))
                        fromDateTime = parsedFrom;
                }

                if (!string.IsNullOrEmpty(denNgay))
                {
                    if (DateTime.TryParseExact(denNgay, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedTo))
                        toDateTime = parsedTo.AddDays(1).AddTicks(-1); // Lấy đến hết ngày
                }


            switch (moiQuanTam)
                {
                    case "ban-hang":
                        return await XuLyBanHang(kieuHienThi, loaiBaoCao, fromDateTime, toDateTime, maLoaiHang, maNhaCungCap, pageNumber, pageSize);
                case "loi-nhuan":
                        return await XuLyLoiNhuan(kieuHienThi, fromDateTime, toDateTime, maLoaiHang, maNhaCungCap, pageNumber, pageSize);
                    case "sua-chua":
                        return await XuLySuaChua(kieuHienThi, fromDateTime, toDateTime, maLoaiHang);
                    case "gia-tri-kho":
                        return await XuLyGiaTriKho(kieuHienThi, maLoaiHang, maNhaCungCap, fromDateTime, toDateTime, pageNumber, pageSize);
                    case "xuat-nhap-ton":
                        return await XuLyXuatNhapTon(kieuHienThi, fromDateTime, toDateTime, maLoaiHang, maNhaCungCap, pageNumber, pageSize);
                    case "xuat-nhap-ton-chi-tiet":
                        return await XuLyXuatNhapTonChiTiet(kieuHienThi, fromDateTime, toDateTime);
                    case "ncc-theo-hang-nhap":
                        return await XuLyNhaCungCapNhap(kieuHienThi,fromDateTime,toDateTime,pageNumber,pageSize,maLoaiHang,maNhaCungCap);
                default:
                        return BadRequest("Loại báo cáo không hợp lệ.");
            }
        }

        private async Task<IActionResult> XuLyBanHang(
            string kieuHienThi,
            string? loaiBaoCao,
            DateTime? from,
            DateTime? to,
            string? maLoaiHang,
            string? maNhaCungCap,
            int? pageNumber = null,
            int? pageSize = null
            )
        {
            // query bán hàng
            var query = _context.SanPhamHoaDons
                .Include(x => x.SanPham)
                .Include(x => x.HoaDon)
                .AsQueryable();

            // Query sửa chữa
            var querySua = _context.CT_HoaDon_PhuTungs
                .Include(x => x.SanPham)
                .Include(x => x.HoaDonSuaChua)
                .AsQueryable();

            //bộ lọc thời gian
            if (from.HasValue)
            {
                query = query.Where(x => x.HoaDon.ThoiGian >= from.Value);
                querySua = querySua.Where(x => x.HoaDonSuaChua.NgayLap >= from.Value);
            }

            if (to.HasValue)
            {
                query = query.Where(x => x.HoaDon.ThoiGian <= to.Value);
                querySua = querySua.Where(x => x.HoaDonSuaChua.NgayLap <= to.Value);
            }

            // Bộ lọc theo loại hàng
            if (!string.IsNullOrEmpty(maLoaiHang)) { 
                query = query.Where(x => x.SanPham.MaLoaiHang == maLoaiHang);
            querySua = querySua.Where(x => x.SanPham.MaLoaiHang == maLoaiHang);
            }
            // Truy vấn phụ phải await xong mới dùng
            if (!string.IsNullOrEmpty(maNhaCungCap))
            {
                var sanPhamCungCap = await _context.NhapHangs
                    .Where(n => n.MaNCC == maNhaCungCap)
                    .Select(n => n.MaSanPham)
                    .Distinct()
                    .ToListAsync();
                query = query.Where(x => sanPhamCungCap.Contains(x.MaSanPham));
                querySua = querySua.Where(x => sanPhamCungCap.Contains(x.MaSanPham));
            }
            // Nếu là báo cáo (bảng)
            if (kieuHienThi == "report")
            {
                var banData = await query
                    .GroupBy(x => new { x.SanPham.MaSanPham, x.SanPham.TenSanPham })
                    .Select(g => new {
                        MaSanPham = g.Key.MaSanPham,
                        TenSanPham = g.Key.TenSanPham,
                        SoLuongBan = g.Sum(x => x.SoLuong),
                        DoanhThu = g.Sum(x => x.SoLuong * x.DonGia),
                        GiaVon = g.Sum(x => x.SoLuong * x.SanPham.GiaVon)
                    }).ToListAsync();

                var suaData = await querySua
                    .GroupBy(x => new { x.SanPham.MaSanPham, x.SanPham.TenSanPham })
                    .Select(g => new {
                        MaSanPham = g.Key.MaSanPham,
                        TenSanPham = g.Key.TenSanPham,
                        SoLuongSua = g.Sum(x => x.SoLuong),
                        DoanhThuSua = g.Sum(x => x.SoLuong * x.DonGia),
                        GiaVonSua = g.Sum(x => x.SoLuong * x.SanPham.GiaVon)
                    }).ToListAsync();

                // Ghép hai bảng lại
                var result_baocao = banData
                    .Union(suaData.Select(x => new {
                        x.MaSanPham,
                        x.TenSanPham,
                        SoLuongBan = 0,
                        DoanhThu = 0m,
                        GiaVon = 0m
                    }))
                    .GroupBy(x => new { x.MaSanPham, x.TenSanPham })
                    .Select(g =>
                    {
                        var ban = banData.FirstOrDefault(b => b.MaSanPham == g.Key.MaSanPham);
                        var sua = suaData.FirstOrDefault(s => s.MaSanPham == g.Key.MaSanPham);
                        int soBan = ban?.SoLuongBan ?? 0;
                        int soSua = sua?.SoLuongSua ?? 0;
                        decimal doanhThu = (ban?.DoanhThu ?? 0) + (sua?.DoanhThuSua ?? 0);
                        decimal giaVon = (ban?.GiaVon ?? 0) + (sua?.GiaVonSua ?? 0);
                        return new BaoCaoHangHoaBanHangDTO
                        {
                            MaSanPham = g.Key.MaSanPham,
                            TenSanPham = g.Key.TenSanPham,
                            SoLuongBan = soBan,
                            SoLuongSua = soSua,
                            DoanhThu = doanhThu,
                            GiaVon = giaVon
                        };
                    }).ToList();
                var tongRow = new BaoCaoHangHoaBanHangDTO
                {
                    MaSanPham = result_baocao.Count.ToString(),
                    TenSanPham = "",
                    SoLuongBan = result_baocao.Sum(x => x.SoLuongBan),
                    SoLuongSua = result_baocao.Sum(x => x.SoLuongSua),
                    DoanhThu = result_baocao.Sum(x => x.DoanhThu),
                    GiaVon = result_baocao.Sum(x => x.GiaVon)
                };
               
                // phân trang
                int currentPage = pageNumber ?? 1;
                int size = pageSize ?? 10;
                var pagedData = result_baocao
                    .Skip((currentPage - 1) * size)
                    .Take(size)
                    .ToList();
                return Ok(new
                {
                    tong = tongRow,
                    data = pagedData,
                    totalItems = result_baocao.Count,
                    currentPage,
                    pageSize = size
                });
            }

            // Gom nhóm và tính toán (biểu đồ)
            var data = await query
                .GroupBy(x => new { x.SanPham.MaSanPham, x.SanPham.TenSanPham })
                .Select(g => new
                {
                    g.Key.MaSanPham,
                    g.Key.TenSanPham,
                    SoLuong = g.Sum(x => x.SoLuong),
                    DoanhThu = g.Sum(x => x.SoLuong * x.DonGia)
                })
                .ToListAsync();

            // Lọc top 10 theo loại báo cáo
            var result_chart = loaiBaoCao switch
            {
                "ban-chay" => data.OrderByDescending(x => x.SoLuong).Take(10).ToList(),
                "tieu-thu" => data.OrderByDescending(x => x.DoanhThu).Take(10).ToList(),
                _ => data.OrderByDescending(x => x.SoLuong).Take(10).ToList()
            };

            return Ok(result_chart);
        }


        private async Task<IActionResult> XuLyLoiNhuan(
            string kieuHienThi, 
            DateTime? from, 
            DateTime? to, 
            string? maLoaiHang,
            string? maNhaCungCap,
            int? pageNumber = null,
            int? pageSize = null)
        {
            // query bán hàng
            var query = _context.SanPhamHoaDons
                .Include(x => x.SanPham)
                .Include(x => x.HoaDon)
                .AsQueryable();

            // Query sửa chữa
            var querySua = _context.CT_HoaDon_PhuTungs
                .Include(x => x.SanPham)
                .Include(x => x.HoaDonSuaChua)
                .AsQueryable();

            //bộ lọc thời gian
            if (from.HasValue)
            {
                query = query.Where(x => x.HoaDon.ThoiGian >= from.Value);
                querySua = querySua.Where(x => x.HoaDonSuaChua.NgayLap >= from.Value);
            }

            if (to.HasValue)
            {
                query = query.Where(x => x.HoaDon.ThoiGian <= to.Value);
                querySua = querySua.Where(x => x.HoaDonSuaChua.NgayLap <= to.Value);
            }
            if (!string.IsNullOrEmpty(maLoaiHang)) query = query.Where(x => x.SanPham.MaLoaiHang == maLoaiHang);
            // Bộ lọc theo loại hàng
            if (!string.IsNullOrEmpty(maLoaiHang))
            {
                query = query.Where(x => x.SanPham.MaLoaiHang == maLoaiHang);
                querySua = querySua.Where(x => x.SanPham.MaLoaiHang == maLoaiHang);
            }
            // Bộ lọc theo nhà cung cấp
            if (!string.IsNullOrEmpty(maNhaCungCap))
            {
                var sanPhamCungCap = await _context.NhapHangs
                    .Where(n => n.MaNCC == maNhaCungCap)
                    .Select(n => n.MaSanPham)
                    .Distinct()
                    .ToListAsync();
                query = query.Where(x => sanPhamCungCap.Contains(x.MaSanPham));
                querySua = querySua.Where(x => sanPhamCungCap.Contains(x.MaSanPham));
            }
            // Nếu là báo cáo (bảng)
            if (kieuHienThi == "report")
            {
                var banData = await query
                    .GroupBy(x => new { x.SanPham.MaSanPham, x.SanPham.TenSanPham })
                    .Select(g => new {
                        MaSanPham = g.Key.MaSanPham,
                        TenSanPham = g.Key.TenSanPham,
                        SoLuongBan = g.Sum(x => x.SoLuong),
                        DoanhThu = g.Sum(x => x.SoLuong * x.DonGia),
                        GiaVon = g.Sum(x => x.SoLuong * x.SanPham.GiaVon)
                    }).ToListAsync();

                var suaData = await querySua
                    .GroupBy(x => new { x.SanPham.MaSanPham, x.SanPham.TenSanPham })
                    .Select(g => new {
                        MaSanPham = g.Key.MaSanPham,
                        TenSanPham = g.Key.TenSanPham,
                        SoLuongSua = g.Sum(x => x.SoLuong),
                        DoanhThuSua = g.Sum(x => x.SoLuong * x.DonGia),
                        GiaVonSua = g.Sum(x => x.SoLuong * x.SanPham.GiaVon)
                    }).ToListAsync();

                // Ghép hai bảng lại
                var result_baocao = banData
                    .Union(suaData.Select(x => new {
                        x.MaSanPham,
                        x.TenSanPham,
                        SoLuongBan = 0,
                        DoanhThu = 0m,
                        GiaVon = 0m
                    }))
                    .GroupBy(x => new { x.MaSanPham, x.TenSanPham })
                    .Select(g =>
                    {
                        var ban = banData.FirstOrDefault(b => b.MaSanPham == g.Key.MaSanPham);
                        var sua = suaData.FirstOrDefault(s => s.MaSanPham == g.Key.MaSanPham);
                        int soBan = ban?.SoLuongBan ?? 0;
                        int soSua = sua?.SoLuongSua ?? 0;
                        decimal doanhThu = (ban?.DoanhThu ?? 0) + (sua?.DoanhThuSua ?? 0);
                        decimal giaVon = (ban?.GiaVon ?? 0) + (sua?.GiaVonSua ?? 0);
                        return new BaoCaoHangHoaBanHangDTO
                        {
                            MaSanPham = g.Key.MaSanPham,
                            TenSanPham = g.Key.TenSanPham,
                            SoLuongBan = soBan,
                            SoLuongSua = soSua,
                            DoanhThu = doanhThu,
                            GiaVon = giaVon
                        };
                    }).OrderByDescending(x => x.LoiNhuan).ToList();
                var tongRow = new BaoCaoHangHoaBanHangDTO
                {
                    MaSanPham = result_baocao.Count.ToString(),
                    TenSanPham = "",
                    SoLuongBan = result_baocao.Sum(x => x.SoLuongBan),
                    SoLuongSua = result_baocao.Sum(x => x.SoLuongSua),
                    DoanhThu = result_baocao.Sum(x => x.DoanhThu),
                    GiaVon = result_baocao.Sum(x => x.GiaVon)
                };

                // phân trang
                int currentPage = pageNumber ?? 1;
                int size = pageSize ?? 10;
                var pagedData = result_baocao
                    .Skip((currentPage - 1) * size)
                    .Take(size)
                    .ToList();
                return Ok(new
                {
                    tong = tongRow,
                    data = pagedData,
                    totalItems = result_baocao.Count,
                    currentPage,
                    pageSize = size
                });
            }
            // biểu đồ
            // Gộp cả bán hàng và sửa chữa lại để biểu đồ đầy đủ
            var banList = await query
                .Select(x => new {
                    x.MaSanPham,
                    TenSanPham = x.SanPham.TenSanPham,
                    SoLuong = x.SoLuong,
                    DonGia = x.DonGia,
                    GiaVon = x.SanPham.GiaVon
                }).ToListAsync();

            var suaList = await querySua
                .Select(x => new {
                    x.MaSanPham,
                    TenSanPham = x.SanPham.TenSanPham,
                    SoLuong = x.SoLuong,
                    DonGia = x.DonGia,
                    GiaVon = x.SanPham.GiaVon
                }).ToListAsync();

            // Gộp dữ liệu và tính tổng hợp theo sản phẩm
            var all = banList.Concat(suaList)
                .GroupBy(x => new { x.MaSanPham, x.TenSanPham })
                .Select(g => new {
                    MaSanPham = g.Key.MaSanPham,
                    TenSanPham = g.Key.TenSanPham,
                    SoLuong = g.Sum(x => x.SoLuong),
                    DoanhThu = g.Sum(x => x.SoLuong * x.DonGia),
                    GiaVon = g.Sum(x => x.SoLuong * x.GiaVon),
                    LoiNhuan = g.Sum(x => (x.DonGia - x.GiaVon) * x.SoLuong)
                })
                .ToList();

            // Tách top 10 cao và thấp
            var topLoiNhuanCao = all.OrderByDescending(x => x.LoiNhuan).Take(10).ToList();
            var topLoiNhuanThap = all.OrderBy(x => x.LoiNhuan).Take(10).ToList();

            return Ok(new
            {
                TopLoiNhuanCaoNhat = topLoiNhuanCao,
                TopLoiNhuanThapNhat = topLoiNhuanThap
            });

        }

        private async Task<IActionResult> XuLySuaChua(string kieuHienThi, DateTime? from, DateTime? to, string? maLoaiHang)
            {
                var queryDV = _context.CT_HoaDon_DichVus
                    .Include(x => x.DichVu)
                    .Include(x => x.HoaDonSuaChua)
                    .AsQueryable();

                var queryPT = _context.CT_HoaDon_PhuTungs
                    .Include(x => x.SanPham)
                    .Include(x => x.HoaDonSuaChua)
                    .AsQueryable();

                if (from.HasValue) queryDV = queryDV.Where(x => x.HoaDonSuaChua.NgayLap >= from);
                if (to.HasValue) queryDV = queryDV.Where(x => x.HoaDonSuaChua.NgayLap <= to);
                if (from.HasValue) queryPT = queryPT.Where(x => x.HoaDonSuaChua.NgayLap >= from);
                if (to.HasValue) queryPT = queryPT.Where(x => x.HoaDonSuaChua.NgayLap <= to);

                if (!string.IsNullOrEmpty(maLoaiHang))
                    queryPT = queryPT.Where(x => x.SanPham.MaLoaiHang == maLoaiHang);

                if (kieuHienThi == "chart")
                {
                    var topDV = await queryDV
                        .GroupBy(x => new { x.MaDichVu, x.DichVu.TenDichVu })
                        .Select(g => new {
                            Ten = g.Key.TenDichVu,
                            SoLuong = g.Count(),
                            TongTien = g.Sum(x => x.DonGia)
                        })
                        .OrderByDescending(x => x.TongTien)
                        .Take(10)
                        .ToListAsync();

                    var topPT = await queryPT
                        .GroupBy(x => new { x.MaSanPham, x.SanPham.TenSanPham })
                        .Select(g => new {
                            Ten = g.Key.TenSanPham,
                            SoLuong = g.Sum(x => x.SoLuong),
                            TongTien = g.Sum(x => x.SoLuong * x.DonGia)
                        })
                        .OrderByDescending(x => x.TongTien)
                        .Take(10)
                        .ToListAsync();

                    return Ok(new { topDichVu = topDV, topPhuTung = topPT });
                }
                else if (kieuHienThi == "report")
                {
                    var dv = await queryDV
                        .Select(x => new {
                            Loai = "Dịch vụ",
                            Ma = x.MaDichVu,
                            Ten = x.DichVu.TenDichVu,
                            SoLuong = 1,
                            DonGia = x.DonGia,
                            ThanhTien = x.DonGia
                        }).ToListAsync();

                    var pt = await queryPT
                        .Select(x => new {
                            Loai = "Phụ tùng",
                            Ma = x.MaSanPham,
                            Ten = x.SanPham.TenSanPham,
                            SoLuong = x.SoLuong,
                            DonGia = x.DonGia,
                            ThanhTien = x.SoLuong * x.DonGia
                        }).ToListAsync();

                    return Ok(dv.Concat(pt));
                }

                return BadRequest("Kiểu hiển thị không hợp lệ");
            }
        private async Task<IActionResult> XuLyGiaTriKho(
            string kieuHienThi,
            string? maLoaiHang,
            string? maNhaCungCap,
            DateTime? from,
            DateTime? to,
            int? pageNumber = null,
            int? pageSize = null)
        {
            var sanPhamQuery = _context.SanPhams.AsQueryable();

            // Bộ lọc loại hàng
            if (!string.IsNullOrEmpty(maLoaiHang))
                sanPhamQuery = sanPhamQuery.Where(sp => sp.MaLoaiHang == maLoaiHang);

            // Bộ lọc nhà cung cấp
            if (!string.IsNullOrEmpty(maNhaCungCap))
            {
                var maSanPhams = _context.NhapHangs
                    .Where(n => n.MaNCC == maNhaCungCap)
                    .Select(n => n.MaSanPham)
                    .Distinct();
                sanPhamQuery = sanPhamQuery.Where(sp => maSanPhams.Contains(sp.MaSanPham));
            }

            // Bộ lọc thời gian nhập hàng
            if (from.HasValue || to.HasValue)
            {
                var maSPTheoThoiGian = _context.NhapHangs
                    .Where(n =>
                        (!from.HasValue || n.ThoiGianTao >= from.Value) &&
                        (!to.HasValue || n.ThoiGianTao <= to.Value))
                    .Select(n => n.MaSanPham)
                    .Distinct();

                sanPhamQuery = sanPhamQuery.Where(sp => maSPTheoThoiGian.Contains(sp.MaSanPham));
            }

            // Truy vấn dữ liệu chính
            var data = await sanPhamQuery
            .Select(sp => new BaoCaoHangHoaGiaTriKhoDTO
            {
                MaSanPham = sp.MaSanPham,
                TenSanPham = sp.TenSanPham,
                TonKho = sp.TonKho,
                GiaVon = sp.GiaVon,
                GiaTriTon = sp.TonKho * sp.GiaVon
            }).ToListAsync();


            // Kiểu biểu đồ
            if (kieuHienThi == "chart")
            {
                var topCao = data.OrderByDescending(x => x.GiaTriTon).Take(10).ToList();
                var topThap = data.OrderBy(x => x.GiaTriTon).Take(10).ToList();

                return Ok(new
                {
                    TopGiaTriTonCaoNhat = topCao,
                    TopGiaTriTonThapNhat = topThap
                });
            }

            // Kiểu bảng có phân trang
            if (kieuHienThi == "report")
            {
                var currentPage = pageNumber ?? 1;
                var size = pageSize ?? 10;
                var totalItems = data.Count;

                var pagedData = data
                    .OrderByDescending(x => x.GiaTriTon)
                    .Skip((currentPage - 1) * size)
                    .Take(size)
                    .ToList();

                var tong = new BaoCaoHangHoaGiaTriKhoDTO
                {
                    MaSanPham = "Tổng",
                    TenSanPham = "",
                    TonKho = data.Sum(x => x.TonKho),
                    GiaVon = 0,
                    GiaTriTon = data.Sum(x => x.GiaTriTon)
                };

                return Ok(new
                {
                    tong,
                    data = pagedData,
                    totalItems,
                    currentPage,
                    pageSize = size
                });
            }

            return BadRequest("Kiểu hiển thị không hợp lệ.");
        }



        private async Task<IActionResult> XuLyXuatNhapTon(
            string kieuHienThi,
            DateTime? from,
            DateTime? to,
            string? maLoaiHang = null,
            string? maNhaCungCap = null,
            int? pageNumber = null,
            int? pageSize = null
            )
        {
            var nhapQuery = _context.NhapHangs.AsQueryable();
            var ban = _context.SanPhamHoaDons.Include(h => h.HoaDon).AsQueryable();
            var sua = _context.CT_HoaDon_PhuTungs.Include(h => h.HoaDonSuaChua).AsQueryable();
            var sanPhamQuery = _context.SanPhams.AsQueryable();

            // Bộ lọc loại hàng
            if (!string.IsNullOrEmpty(maLoaiHang))
                sanPhamQuery = sanPhamQuery.Where(sp => sp.MaLoaiHang == maLoaiHang);

            // Bộ lọc theo nhà cung cấp
            if (!string.IsNullOrEmpty(maNhaCungCap))
            {
                var maSpTheoNCC = await _context.NhapHangs
                    .Where(n => n.MaNCC == maNhaCungCap)
                    .Select(n => n.MaSanPham)
                    .Distinct()
                    .ToListAsync();

                sanPhamQuery = sanPhamQuery.Where(sp => maSpTheoNCC.Contains(sp.MaSanPham));
            }

            var danhSachSanPham = await sanPhamQuery.ToListAsync();

            // Bộ lọc thời gian
            if (from.HasValue) nhapQuery = nhapQuery.Where(x => x.ThoiGianTao >= from);
            if (to.HasValue) nhapQuery = nhapQuery.Where(x => x.ThoiGianTao <= to);
            if (from.HasValue) ban = ban.Where(x => x.HoaDon.ThoiGian >= from);
            if (to.HasValue) ban = ban.Where(x => x.HoaDon.ThoiGian <= to);
            if (from.HasValue) sua = sua.Where(x => x.HoaDonSuaChua.NgayLap >= from);
            if (to.HasValue) sua = sua.Where(x => x.HoaDonSuaChua.NgayLap <= to);

            // ✅ Load dữ liệu nhập hàng về RAM
            var nhapList = await nhapQuery.ToListAsync();
            var nhapDict = nhapList
                .GroupBy(x => x.MaSanPham)
                .ToDictionary(
                    g => g.Key,
                    g => g.Sum(x => int.TryParse(x.Soluong, out var s) ? s : 0)
                );

            var danhSach = danhSachSanPham.Select(sp =>
            {
                var maSp = sp.MaSanPham;

                var slNhap = nhapDict.ContainsKey(maSp) ? nhapDict[maSp] : 0;

                var slBan = ban.Where(x => x.MaSanPham == maSp).Sum(x => (int?)x.SoLuong) ?? 0;
                var slSua = sua.Where(x => x.MaSanPham == maSp).Sum(x => (int?)x.SoLuong) ?? 0;

                var tonKho = sp.TonKho;
                var tonDau = tonKho + slBan + slSua;

                return new BaoCaoHangHoaXuatNhapTonDTO
                {
                    MaSanPham = maSp,
                    TenSanPham = sp.TenSanPham,
                    SoLuongNhap = slNhap,
                    SoLuongBan = slBan,
                    SoLuongSua = slSua,
                    TonKho = tonKho,
                    TonDau = tonDau
                };
            }).ToList();

            if (kieuHienThi == "chart")
            {
                var topTonCaoNhat = danhSach.OrderByDescending(x => x.TonKho).Take(10).ToList();
                var topTonThapNhat = danhSach.OrderBy(x => x.TonKho).Take(10).ToList();
                return Ok(new { TopTonCaoNhat = topTonCaoNhat, TopTonThapNhat = topTonThapNhat });
            }

            if (kieuHienThi == "report")
            {
                int page = pageNumber ?? 1;
                int size = pageSize ?? 10;

                var pagedData = danhSach
                    .OrderByDescending(x => x.TonKho)
                    .Skip((page - 1) * size)
                    .Take(size)
                    .ToList();

                var tong = new BaoCaoHangHoaXuatNhapTonDTO
                {
                    MaSanPham = "Tổng",
                    TenSanPham = "",
                    SoLuongNhap = danhSach.Sum(x => x.SoLuongNhap),
                    SoLuongBan = danhSach.Sum(x => x.SoLuongBan),
                    SoLuongSua = danhSach.Sum(x => x.SoLuongSua),
                    TonKho = danhSach.Sum(x => x.TonKho),
                    TonDau = danhSach.Sum(x => x.TonDau)
                };

                return Ok(new { tong, data = pagedData, totalItems = danhSach.Count });
            }

            return BadRequest("Kiểu hiển thị không hợp lệ");
        }



        private async Task<IActionResult> XuLyXuatNhapTonChiTiet(string kieuHienThi, DateTime? from, DateTime? to)
        {
            var nhap = await _context.NhapHangs
                .Include(x => x.SanPham)
                .Where(x => (!from.HasValue || x.ThoiGianTao >= from) && (!to.HasValue || x.ThoiGianTao <= to))
                .Select(x => new XuatNhapTonChiTietDto
                {
                    Ngay = x.ThoiGianTao,
                    Loai = "Nhập hàng",
                    TenSanPham = x.SanPham.TenSanPham,
                    SoLuong = Convert.ToInt32(x.Soluong),
                    DonGia = x.TienNhap,
                    ThanhTien = Convert.ToInt32(x.Soluong) * x.TienNhap
                }).ToListAsync();

            var ban = await _context.SanPhamHoaDons
                .Include(x => x.SanPham)
                .Include(x => x.HoaDon)
                .Where(x => (!from.HasValue || x.HoaDon.ThoiGian >= from) && (!to.HasValue || x.HoaDon.ThoiGian <= to))
                .Select(x => new XuatNhapTonChiTietDto
                {
                    Ngay = x.HoaDon.ThoiGian,
                    Loai = "Bán hàng",
                    TenSanPham = x.SanPham.TenSanPham,
                    SoLuong = x.SoLuong,
                    DonGia = x.DonGia,
                    ThanhTien = x.SoLuong * x.DonGia
                }).ToListAsync();

            var sua = await _context.CT_HoaDon_PhuTungs
                .Include(x => x.SanPham)
                .Include(x => x.HoaDonSuaChua)
                .Where(x => (!from.HasValue || x.HoaDonSuaChua.NgayLap >= from) && (!to.HasValue || x.HoaDonSuaChua.NgayLap <= to))
                .Select(x => new XuatNhapTonChiTietDto
                {
                    Ngay = x.HoaDonSuaChua.NgayLap,
                    Loai = "Sửa chữa",
                    TenSanPham = x.SanPham.TenSanPham,
                    SoLuong = x.SoLuong,
                    DonGia = x.DonGia,
                    ThanhTien = x.SoLuong * x.DonGia
                }).ToListAsync();

            // Gộp tất cả và sắp xếp
            var ketQua = nhap.Concat(ban).Concat(sua).OrderBy(x => x.Ngay).ToList();

            return Ok(ketQua);
        }


        private async Task<IActionResult> XuLyNhaCungCapNhap(
     string kieuHienThi,
     DateTime? from,
     DateTime? to,
     int? pageNumber = null,
     int? pageSize = null,
     string? maLoaiHang = null,
     string? maNhaCungCap = null)
        {
            var query = _context.NhapHangs
                .Include(x => x.NhaCungCap)
                .Include(x => x.SanPham)
                .AsQueryable();

            if (from.HasValue) query = query.Where(x => x.ThoiGianTao >= from);
            if (to.HasValue) query = query.Where(x => x.ThoiGianTao <= to);
            if (!string.IsNullOrEmpty(maLoaiHang))
                query = query.Where(x => x.SanPham.MaLoaiHang == maLoaiHang);
            if (!string.IsNullOrEmpty(maNhaCungCap))
                query = query.Where(x => x.MaNCC == maNhaCungCap);

            // Load dữ liệu về RAM để xử lý TryParse
            var rawData = await query.ToListAsync();

            var data = rawData
                .GroupBy(x => new
                {
                    x.MaNCC,
                    x.NhaCungCap.TenNCC,
                    x.NhaCungCap.NhomNCC,
                    x.SanPham.TenSanPham
                })
                .Select(g =>
                {
                    int tongSoLuong = g.Sum(x => int.TryParse(x.Soluong, out var s) ? s : 0);
                    decimal tongTien = g.Sum(x => int.TryParse(x.Soluong, out var s) ? s * x.TienNhap : 0);
                    decimal tienNhap = g.Sum(x => x.TienNhap);

                    return new BaoCaoHangHoaNhaCungCapNhapDTO
                    {
                        MaNCC = g.Key.MaNCC,
                        TenNCC = g.Key.TenNCC,
                        NhomNCC = g.Key.NhomNCC,
                        TenSanPham = g.Key.TenSanPham,
                        TongSoLuong = tongSoLuong,
                        TienNhap = tienNhap,
                        TongTien = tongTien
                    };
                })
                .ToList();

            // Hiển thị biểu đồ
            if (kieuHienThi == "chart")
            {
                var topNCCNhapCaoNhat = data.OrderByDescending(x => x.TongTien).Take(10).ToList();
                var topNCCNhapThapNhat = data.OrderBy(x => x.TongTien).Take(10).ToList();
                return Ok(new
                {
                    TopNCCNhapCaoNhat = topNCCNhapCaoNhat,
                    TopNCCNhapThapNhat = topNCCNhapThapNhat
                });
            }

            // Hiển thị bảng (report)
            if (kieuHienThi == "report")
            {
                int currentPage = pageNumber ?? 1;
                int size = pageSize ?? 10;
                var totalItems = data.Count;

                var pagedData = data
                    .OrderByDescending(x => x.TongTien)
                    .Skip((currentPage - 1) * size)
                    .Take(size)
                    .ToList();

                var tong = new BaoCaoHangHoaNhaCungCapNhapDTO
                {
                    MaNCC = "Tổng",
                    NhomNCC = "",
                    TenNCC = "",
                    TenSanPham = "",
                    TongSoLuong = data.Sum(x => x.TongSoLuong),
                    TienNhap = 0,
                    TongTien = data.Sum(x => x.TongTien)
                };

                return Ok(new
                {
                    tong,
                    data = pagedData,
                    totalItems,
                    currentPage,
                    pageSize = size
                });
            }

            return BadRequest("Kiểu hiển thị không hợp lệ.");
        }
        [HttpGet("xuat-excel")]
        public async Task<IActionResult> ExportHangHoaExcel(
        [FromQuery] string moiQuanTam,
        [FromQuery] string kieuHienThi,
        [FromQuery] string? loaiBaoCao,
        [FromQuery] string? thoiGian,
        [FromQuery] string? tuNgay,
        [FromQuery] string? denNgay,
        [FromQuery] string? maLoaiHang,
        [FromQuery] string? maNhaCungCap)
        {
            // Parse thời gian như GetBaoCaoHangHoa
            DateTime? from = null, to = null;
            DateTime today = DateTime.Today;

            if (string.IsNullOrEmpty(tuNgay) && string.IsNullOrEmpty(denNgay) && !string.IsNullOrEmpty(thoiGian))
            {
                (from, to) = XuLyThoiGian(thoiGian, today);
            }

            if (!string.IsNullOrEmpty(tuNgay) && DateTime.TryParseExact(tuNgay, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedFrom))
                from = parsedFrom;

            if (!string.IsNullOrEmpty(denNgay) && DateTime.TryParseExact(denNgay, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedTo))
                to = parsedTo.AddDays(1).AddTicks(-1);

            // Gọi xử lý theo mối quan tâm
            IActionResult result;

            switch (moiQuanTam)
            {
                case "ban-hang":
                    return await XuatExcelBanHang(from, to, maLoaiHang, maNhaCungCap);
                case "loi-nhuan":
                    return await XuatExcelLoiNhuan(from, to, maLoaiHang, maNhaCungCap);
                case "gia-tri-kho":
                    return await XuatExcelGiaTriKho(from, to, maLoaiHang, maNhaCungCap);
                case "xuat-nhap-ton":
                    return await XuatExcelXuatNhapTon(from, to, maLoaiHang, maNhaCungCap);
                case "ncc-theo-hang-nhap":
                    return await XuatExcelNhaCungCapNhap(from, to, maLoaiHang, maNhaCungCap);
                default:
                    return BadRequest("Loại báo cáo không hợp lệ.");
            }

        }
        private async Task<IActionResult> XuatExcelBanHang(
         DateTime? from, DateTime? to, string? maLoaiHang, string? maNhaCungCap)
        {
            var result = await XuLyBanHang("report", null, from, to, maLoaiHang, maNhaCungCap) as OkObjectResult;
            if (result == null || result.Value == null) return BadRequest("Không có dữ liệu");

            dynamic data = result.Value;

            var list = ((IEnumerable<object>)data.data).Cast<dynamic>().ToList();
            var tong = data.tong;

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Bán hàng");

            ws.Cell(1, 1).Value = "Báo cáo bán hàng";
            ws.Range("A1:G1").Merge().Style.Font.SetBold().Font.FontSize = 14;
            ws.Cell(2, 1).Value = $"Ngày lập: {DateTime.Now:dd/MM/yyyy HH:mm}";
            ws.Range("A2:G2").Merge();

            string[] headers = { "Mã SP", "Tên SP", "SL bán", "SL sửa", "Tổng SL", "Doanh thu", "Giá vốn" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(4, i + 1).Value = headers[i];
                ws.Cell(4, i + 1).Style.Font.SetBold();
                ws.Cell(4, i + 1).Style.Fill.BackgroundColor = XLColor.LightBlue;
            }

            int row = 5;
            foreach (var item in list)
            {
                ws.Cell(row, 1).Value = item.MaSanPham;
                ws.Cell(row, 2).Value = item.TenSanPham;
                ws.Cell(row, 3).Value = item.SoLuongBan;
                ws.Cell(row, 4).Value = item.SoLuongSua;
                ws.Cell(row, 5).Value = (int)item.SoLuongBan + (int)item.SoLuongSua;
                ws.Cell(row, 6).Value = item.DoanhThu;
                ws.Cell(row, 7).Value = item.GiaVon;
                row++;
            }

            ws.Columns().AdjustToContents();
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"BaoCaoBanHang_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }
        // 1. Xuất Excel - Lợi nhuận
        private async Task<IActionResult> XuatExcelLoiNhuan(DateTime? from, DateTime? to, string? maLoaiHang, string? maNhaCungCap)
        {
            var result = await XuLyLoiNhuan("report", from, to, maLoaiHang, maNhaCungCap) as OkObjectResult;
            if (result?.Value == null) return BadRequest("Không có dữ liệu");

            dynamic data = result.Value;
            var list = ((IEnumerable<object>)data.data).Cast<dynamic>().ToList();
            var tong = data.tong;

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Lợi nhuận");

            ws.Cell(1, 1).Value = "Báo cáo lợi nhuận";
            ws.Range("A1:H1").Merge().Style.Font.SetBold().Font.FontSize = 14;
            ws.Cell(2, 1).Value = $"Ngày lập: {DateTime.Now:dd/MM/yyyy HH:mm}";
            ws.Range("A2:H2").Merge();

            string[] headers = { "Mã SP", "Tên SP", "SL bán", "SL sửa", "Doanh thu", "Giá vốn", "Lợi nhuận" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(4, i + 1).Value = headers[i];
                ws.Cell(4, i + 1).Style.Font.SetBold();
                ws.Cell(4, i + 1).Style.Fill.BackgroundColor = XLColor.LightBlue;
            }

            int row = 5;
            foreach (var item in list)
            {
                decimal doanhThu = item.DoanhThu;
                decimal giaVon = item.GiaVon;
                decimal loiNhuan = doanhThu - giaVon;

                ws.Cell(row, 1).Value = item.MaSanPham;
                ws.Cell(row, 2).Value = item.TenSanPham;
                ws.Cell(row, 3).Value = item.SoLuongBan;
                ws.Cell(row, 4).Value = item.SoLuongSua;
                ws.Cell(row, 5).Value = doanhThu;
                ws.Cell(row, 6).Value = giaVon;
                ws.Cell(row, 7).Value = loiNhuan;
                row++;
            }

            ws.Columns().AdjustToContents();
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"BaoCaoLoiNhuan_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }

        // 2. Xuất Excel - Giá trị kho
        private async Task<IActionResult> XuatExcelGiaTriKho(DateTime? from, DateTime? to, string? maLoaiHang, string? maNhaCungCap)
        {
            var result = await XuLyGiaTriKho("report", maLoaiHang, maNhaCungCap, from, to) as OkObjectResult;
            if (result?.Value == null) return BadRequest("Không có dữ liệu");

            dynamic data = result.Value;
            var list = ((IEnumerable<object>)data.data).Cast<dynamic>().ToList();
            var tong = data.tong;

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Giá trị kho");

            ws.Cell(1, 1).Value = "Báo cáo giá trị kho";
            ws.Range("A1:E1").Merge().Style.Font.SetBold().Font.FontSize = 14;
            ws.Cell(2, 1).Value = $"Ngày lập: {DateTime.Now:dd/MM/yyyy HH:mm}";
            ws.Range("A2:E2").Merge();

            string[] headers = { "Mã SP", "Tên SP", "Tồn kho", "Giá vốn", "Giá trị tồn" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(4, i + 1).Value = headers[i];
                ws.Cell(4, i + 1).Style.Font.SetBold();
                ws.Cell(4, i + 1).Style.Fill.BackgroundColor = XLColor.LightBlue;
            }

            int row = 5;
            foreach (var item in list)
            {
                ws.Cell(row, 1).Value = item.MaSanPham;
                ws.Cell(row, 2).Value = item.TenSanPham;
                ws.Cell(row, 3).Value = item.TonKho;
                ws.Cell(row, 4).Value = item.GiaVon;
                ws.Cell(row, 5).Value = item.GiaTriTon;
                row++;
            }

            ws.Columns().AdjustToContents();
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"BaoCaoGiaTriKho_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }

        // 3. Xuất Excel - Xuất nhập tồn
        private async Task<IActionResult> XuatExcelXuatNhapTon(DateTime? from, DateTime? to, string? maLoaiHang, string? maNhaCungCap)
        {
            var result = await XuLyXuatNhapTon("report", from, to, maLoaiHang, maNhaCungCap) as OkObjectResult;
            if (result?.Value == null) return BadRequest("Không có dữ liệu");

            dynamic data = result.Value;
            var list = ((IEnumerable<object>)data.data).Cast<dynamic>().ToList();
            var tong = data.tong;

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Xuất nhập tồn");

            ws.Cell(1, 1).Value = "Báo cáo xuất nhập tồn";
            ws.Range("A1:G1").Merge().Style.Font.SetBold().Font.FontSize = 14;
            ws.Cell(2, 1).Value = $"Ngày lập: {DateTime.Now:dd/MM/yyyy HH:mm}";
            ws.Range("A2:G2").Merge();

            string[] headers = { "Mã SP", "Tên SP", "Tồn đầu", "Nhập", "Bán", "Sửa", "Tồn kho" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(4, i + 1).Value = headers[i];
                ws.Cell(4, i + 1).Style.Font.SetBold();
                ws.Cell(4, i + 1).Style.Fill.BackgroundColor = XLColor.LightBlue;
            }

            int row = 5;
            foreach (var item in list)
            {
                ws.Cell(row, 1).Value = item.MaSanPham;
                ws.Cell(row, 2).Value = item.TenSanPham;
                ws.Cell(row, 3).Value = item.TonDau;
                ws.Cell(row, 4).Value = item.SoLuongNhap;
                ws.Cell(row, 5).Value = item.SoLuongBan;
                ws.Cell(row, 6).Value = item.SoLuongSua;
                ws.Cell(row, 7).Value = item.TonKho;
                row++;
            }

            ws.Columns().AdjustToContents();
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"BaoCaoXuatNhapTon_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }
        private async Task<IActionResult> XuatExcelNhaCungCapNhap(DateTime? from, DateTime? to, string? maLoaiHang, string? maNhaCungCap)
        {
            var result = await XuLyNhaCungCapNhap("report", from, to, null, null, maLoaiHang, maNhaCungCap) as OkObjectResult;
            if (result?.Value == null) return BadRequest("Không có dữ liệu");

            dynamic data = result.Value;
            var list = ((IEnumerable<object>)data.data).Cast<dynamic>().ToList();
            var tong = data.tong;

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("NCC Nhập hàng");

            ws.Cell(1, 1).Value = "Báo cáo NCC theo hàng nhập";
            ws.Range("A1:G1").Merge().Style.Font.SetBold().Font.FontSize = 14;
            ws.Cell(2, 1).Value = $"Ngày lập: {DateTime.Now:dd/MM/yyyy HH:mm}";
            ws.Range("A2:G2").Merge();

            string[] headers = { "Mã NCC", "Tên NCC", "Nhóm NCC", "Tên SP", "SL Nhập", "Tiền nhập", "Tổng tiền" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(4, i + 1).Value = headers[i];
                ws.Cell(4, i + 1).Style.Font.SetBold();
                ws.Cell(4, i + 1).Style.Fill.BackgroundColor = XLColor.LightBlue;
            }

            int row = 5;
            foreach (var item in list)
            {
                ws.Cell(row, 1).Value = item.MaNCC;
                ws.Cell(row, 2).Value = item.TenNCC;
                ws.Cell(row, 3).Value = item.NhomNCC;
                ws.Cell(row, 4).Value = item.TenSanPham;
                ws.Cell(row, 5).Value = item.TongSoLuong;
                ws.Cell(row, 6).Value = item.TienNhap;
                ws.Cell(row, 7).Value = item.TongTien;
                row++;
            }

            ws.Columns().AdjustToContents();
            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"BaoCaoNCCNhap_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }

        private (DateTime?, DateTime?) XuLyThoiGian(string thoiGian, DateTime today)
        {
            switch (thoiGian)
            {
                case "Hôm nay":
                    return (today, today.AddDays(1).AddTicks(-1));
                case "Hôm qua":
                    var y = today.AddDays(-1);
                    return (y, y.AddDays(1).AddTicks(-1));
                case "7 ngày qua":
                    return (today.AddDays(-6), today.AddDays(1).AddTicks(-1));
                case "Tháng này":
                    var f = new DateTime(today.Year, today.Month, 1);
                    return (f, f.AddMonths(1).AddTicks(-1));
                default:
                    return (null, null);
            }
        }

    }
}

