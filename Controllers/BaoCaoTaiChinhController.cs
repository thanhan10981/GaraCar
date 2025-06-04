using GaraCarAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.Globalization;
using ClosedXML.Excel;
using ClosedXML.Extensions;

namespace GARA.Controllers
{
    [Route("api/bao-cao")]
    [ApiController]
    public class BaoCaoTaiChinhController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public BaoCaoTaiChinhController(GaraCarContext context)
        {
            _context = context;
        }

        [HttpGet("tai-chinh")]
        public IActionResult GetBaoCaoTaiChinh(
            [FromQuery] string? thoiGian,
            [FromQuery] string? tuNgay,
            [FromQuery] string? denNgay
         )
        {
            DateTime today = DateTime.Today;
            DateTime? fromDateTime = null, toDateTime = null;

            // Xử lý lọc thời gian nhanh
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

            // Ưu tiên tuNgay / denNgay nếu có
            if (!string.IsNullOrEmpty(tuNgay) &&
                DateTime.TryParseExact(tuNgay, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedFrom))
            {
                fromDateTime = parsedFrom;
            }

            if (!string.IsNullOrEmpty(denNgay) &&
                DateTime.TryParseExact(denNgay, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedTo))
            {
                toDateTime = parsedTo.AddDays(1).AddTicks(-1); // Tính đến hết ngày
            }

            // Lọc hóa đơn bán hàng
            var hoaDons = _context.HoaDons
             .Include(h => h.SanPhamHoaDons).ThenInclude(sp => sp.SanPham)
             .Where(h => (!fromDateTime.HasValue || h.ThoiGian >= fromDateTime) && (!toDateTime.HasValue || h.ThoiGian <= toDateTime))
             .ToList();

            // Lọc hóa đơn sửa chữa
            var hoaDonSuaChuas = _context.HoaDonSuaChuas
            .Include(h => h.ChiTietPhuTungs).ThenInclude(p => p.SanPham)
            .Include(h => h.ChiTietDichVus).ThenInclude(d => d.DichVu)
            .Where(h => (!fromDateTime.HasValue || h.NgayLap >= fromDateTime) && (!toDateTime.HasValue || h.NgayLap <= toDateTime))
            .ToList();

            // Lọc sổ quỹ
            var soQuy = _context.SoQuys
                .Where(s => (!fromDateTime.HasValue || s.ThoiGian >= fromDateTime) && (!toDateTime.HasValue || s.ThoiGian <= toDateTime))
                .ToList();

            // Tính toán
            var doanhThuBanHang = hoaDons.Sum(h => h.TongTien);
            var giaVonBanHang = hoaDons.SelectMany(h => h.SanPhamHoaDons).Sum(sp => sp.SoLuong * (sp.SanPham?.GiaVon ?? 0));

            var doanhThuSuaChua = hoaDonSuaChuas.Sum(h => h.TongTien);
            var giaVonSuaChua = hoaDonSuaChuas
                .SelectMany(h => h.ChiTietPhuTungs)
                .Sum(p => p.SoLuong * (p.SanPham?.GiaVon ?? 0));

            var luongNhanVien = soQuy.Where(s => s.LoaiThuChi == "Phiếu chi" && s.DoiTuongNhan == "Nhân viên").Sum(s => s.GiaTri);
            var chiKhac = soQuy.Where(s => s.LoaiThuChi == "Phiếu chi" && s.DoiTuongNhan != "Nhân viên").Sum(s => s.GiaTri);
            var thuKhac = soQuy.Where(s => s.LoaiThuChi == "Phiếu thu").Sum(s => s.GiaTri);

            var tongChiPhi = luongNhanVien + chiKhac;

            var doanhThu = doanhThuBanHang + doanhThuSuaChua;
            var giaVon = giaVonBanHang + giaVonSuaChua;
            var loiNhuanGop = doanhThu - giaVon;
            var loiNhuanThuan = loiNhuanGop - tongChiPhi + thuKhac;

            return Ok(new
            {
                doanhThuBanHang,
                doanhThuSuaChua,
                doanhThu,
                giaVonBanHang,
                giaVonSuaChua,
                giaVon,
                loiNhuanGop,
                luongNhanVien,
                chiKhac,
                thuKhac,
                tongChiPhi,
                loiNhuanThuan
            });
        }
        [HttpGet("tai-chinh/xuat-excel")]
        public async Task<IActionResult> ExportBaoCaoTaiChinhToExcel(
    [FromQuery] string? thoiGian,
    [FromQuery] string? tuNgay,
    [FromQuery] string? denNgay)
        {
            var result = GetBaoCaoTaiChinh(thoiGian, tuNgay, denNgay) as OkObjectResult;
            if (result == null || result.Value == null)
                return BadRequest("Không thể lấy dữ liệu báo cáo");

            dynamic data = result.Value;

            using var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add("Báo cáo tài chính");

            ws.Cell(1, 1).Value = $"Ngày lập: {DateTime.Now:dd/MM/yyyy HH:mm}";
            ws.Range("A1:D1").Merge().Style.Font.SetBold().Font.FontSize = 12;

            ws.Cell(2, 1).Value = "Báo cáo kết quả hoạt động kinh doanh";
            ws.Range("A2:D2").Merge().Style.Font.SetBold().Font.FontSize = 14;
            ws.Cell(3, 1).Value = $"Thời gian: {thoiGian ?? "Tuỳ chọn"}";
            ws.Range("A3:D3").Merge();

            int row = 5;

            ws.Cell(row, 1).Value = "Tổng";
            ws.Range(row, 1, row, 4).Style.Fill.SetBackgroundColor(XLColor.LightBlue);
            row++;

            void AddRow(string stt, string description, string? formulaKey = null)
            {
                ws.Cell(row, 1).Value = stt;
                ws.Cell(row, 2).Value = description;
                ws.Cell(row, 3).Value = formulaKey ?? "";

                var value = data?.GetType().GetProperty(formulaKey ?? "")?.GetValue(data) ?? 0;
                ws.Cell(row, 4).Value = value;

                // Định dạng
                ws.Cell(row, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Cell(row, 2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                ws.Cell(row, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Cell(row, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                ws.Cell(row, 4).Style.NumberFormat.Format = "#,##0";

                row++;
            }


            AddRow("(1)", "Doanh thu bán hàng", "doanhThuBanHang");
            AddRow("(2)", "Doanh thu sửa chữa", "doanhThuSuaChua");
            AddRow("(3)", "Tổng doanh thu = (1) + (2)", "doanhThu");
            AddRow("(4)", "Giá vốn bán hàng", "giaVonBanHang");
            AddRow("(5)", "Giá vốn sửa chữa", "giaVonSuaChua");
            AddRow("(6)", "Tổng giá vốn = (4) + (5)", "giaVon");
            AddRow("(7)", "Lợi nhuận gộp = (3) - (6)", "loiNhuanGop");
            AddRow("(8)", "Lương nhân viên", "luongNhanVien");
            AddRow("(9)", "Chi phí khác", "chiKhac");
            AddRow("(10)", "Tổng chi phí = (8) + (9)", "tongChiPhi");
            AddRow("(11)", "Thu nhập khác", "thuKhac");

            ws.Range(row, 1, row, 4).Style.Fill.SetBackgroundColor(XLColor.LightGreen);
            AddRow("(12)", "Lợi nhuận thuần = (7) - (10) + (11)", "loiNhuanThuan");

            ws.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            string fileName = $"BaoCaoTaiChinh_{DateTime.Now:yyyyMMddHHmmss}.xlsx";
            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName);
        }

    }
}
