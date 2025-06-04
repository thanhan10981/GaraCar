using ClosedXML.Excel;
using GARA.DTOs;
using GaraCarAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
namespace GARA.Controllers
{
    [Route("api/bao-cao")]
    [ApiController]
    public class BaoCaoNhaCungCapController : ControllerBase
    {
        private readonly GaraCarContext _context;

        public BaoCaoNhaCungCapController(GaraCarContext context)
        {
            _context = context;
        }

        [HttpGet("nha-cung-cap")]
        public async Task<IActionResult> GetBaoCaoNhaCungCap(
            [FromQuery] string moiQuanTam,
            [FromQuery] DateTime? tuNgay,
            [FromQuery] DateTime? denNgay,
            [FromQuery] string? maNhaCungCap,
            [FromQuery] int? pageNumber,
            [FromQuery] int? pageSize)
        {
            var query = _context.NhapHangs.Include(n => n.NhaCungCap).AsQueryable();

            if (tuNgay.HasValue)
                query = query.Where(n => n.ThoiGianTao >= tuNgay);
            if (denNgay.HasValue)
                query = query.Where(n => n.ThoiGianTao <= denNgay);
            if (!string.IsNullOrEmpty(maNhaCungCap))
                query = query.Where(n => n.MaNCC == maNhaCungCap);

            var grouped = await query
                .GroupBy(n => new { n.MaNCC, n.NhaCungCap.TenNCC })
                .Select(g => new
                {
                    g.Key.MaNCC,
                    g.Key.TenNCC,
                    GiaTriNhap = g.Sum(x => x.TienNhap),
                    GiaTriTra = g.Sum(x => x.TienNo),
                    SoLuongs = g.Select(x => x.Soluong).ToList()
                })
                .ToListAsync();

            var result = grouped.Select(g =>
            {
                int tongSoLuong = 0;
                foreach (var sl in g.SoLuongs)
                {
                    if (int.TryParse(sl, out var val))
                        tongSoLuong += val;
                }

                return new BaoCaoNhaCungCapDTO
                {
                    MaNCC = g.MaNCC,
                    TenNCC = g.TenNCC,
                    GiaTriNhap = g.GiaTriNhap,
                    GiaTriTra = g.GiaTriTra ?? 0,

                    NoDauKy = moiQuanTam == "cong-no" ? 1_000_000 : 0, // Giả định dữ liệu đầu kỳ
                    GhiNo   = moiQuanTam == "cong-no" ? g.GiaTriNhap : 0, // Ghi nhận nợ là nhập

                    SoLuongNhap = moiQuanTam == "hang-nhap-theo-ncc" ? tongSoLuong : 0,
                    SoLuongTra = 0,
                    GhiChu = ""
                };
            }).ToList();

            var tong = new BaoCaoNhaCungCapDTO
            {
                MaNCC = "Tổng",
                TenNCC = "",
                GiaTriNhap = result.Sum(x => x.GiaTriNhap),
                GiaTriTra = result.Sum(x => x.GiaTriTra),
                NoDauKy = result.Sum(x => x.NoDauKy),
                GhiNo = result.Sum(x => x.GhiNo),
                SoLuongNhap = result.Sum(x => x.SoLuongNhap),
                SoLuongTra = result.Sum(x => x.SoLuongTra),
                GhiChu = ""
            };

            int page = pageNumber ?? 1;
            int size = pageSize ?? 10;

            var dataPaged = result
                .OrderByDescending(x => x.GiaTriNhap)
                .Skip((page - 1) * size)
                .Take(size)
                .ToList();

            return Ok(new
            {
                tong,
                data = dataPaged,
                totalItems = result.Count,
                currentPage = page,
                pageSize = size
            });
        }
        [HttpGet("nha-cung-cap/xuat-excel")]
        public async Task<IActionResult> ExportBaoCaoNhaCungCapToExcel(
    [FromQuery] string moiQuanTam,
    [FromQuery] DateTime? tuNgay,
    [FromQuery] DateTime? denNgay,
    [FromQuery] string? maNhaCungCap)
        {
            var result = await GetBaoCaoNhaCungCap(moiQuanTam, tuNgay, denNgay, maNhaCungCap, null, null) as OkObjectResult;
            if (result == null || result.Value == null)
                return BadRequest("Không thể lấy dữ liệu báo cáo");

            dynamic value = result.Value;
            var dataList = ((IEnumerable<object>)value.data).Cast<dynamic>().ToList();
            var tong = value.tong;

            using var workbook = new ClosedXML.Excel.XLWorkbook();
            var ws = workbook.Worksheets.Add("Báo cáo nhà cung cấp");

            ws.Cell(1, 1).Value = "Báo cáo nhà cung cấp";
            ws.Range("A1:H1").Merge().Style.Font.SetBold().Font.FontSize = 14;
            ws.Cell(2, 1).Value = $"Ngày lập: {DateTime.Now:dd/MM/yyyy HH:mm}";
            ws.Range("A2:H2").Merge();

            // Header
            var header = new[] {
        "Mã NCC", "Tên NCC", "Giá trị nhập", "Giá trị trả",
        "Nợ đầu kỳ", "Ghi nợ", "Số lượng nhập", "Số lượng trả"
    };

            for (int i = 0; i < header.Length; i++)
            {
                ws.Cell(4, i + 1).Value = header[i];
                ws.Cell(4, i + 1).Style.Font.SetBold();
                ws.Cell(4, i + 1).Style.Fill.BackgroundColor = XLColor.LightBlue;
                ws.Cell(4, i + 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Cell(4, i + 1).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }

            int row = 5;

            void FillRow(dynamic item)
            {
                ws.Cell(row, 1).Value = item.MaNCC;
                ws.Cell(row, 2).Value = item.TenNCC;
                ws.Cell(row, 3).Value = item.GiaTriNhap;
                ws.Cell(row, 4).Value = item.GiaTriTra;
                ws.Cell(row, 5).Value = item.NoDauKy;
                ws.Cell(row, 6).Value = item.GhiNo;
                ws.Cell(row, 7).Value = item.SoLuongNhap;
                ws.Cell(row, 8).Value = item.SoLuongTra;

                for (int col = 3; col <= 8; col++)
                {
                    ws.Cell(row, col).Style.NumberFormat.Format = "#,##0";
                    ws.Cell(row, col).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                }

                row++;
            }

            foreach (var item in dataList)
                FillRow(item);

            // Thêm dòng tổng
            ws.Cell(row, 1).Value = "Tổng";
            ws.Range(row, 1, row, 2).Merge().Style.Font.SetBold().Fill.BackgroundColor = XLColor.LightGreen;

            FillRow(tong);

            ws.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            string fileName = $"BaoCaoNhaCungCap_{DateTime.Now:yyyyMMddHHmmss}.xlsx";
            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName);
        }

    }
}
