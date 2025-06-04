using Microsoft.EntityFrameworkCore;

namespace GARA.DTOs
{
    [Keyless]
    public class BaoCaoHoaDon
    {
        public string Loai { get; set; }
        public string MaHoaDon { get; set; }
        public DateTime ThoiGian { get; set; }
        public string KhachHang { get; set; }
        public string? KhachHangId { get; set; }      // Thêm property này
        public string NhanVien { get; set; }
        public string? NhanVienId { get; set; }       // Thêm property này
        public decimal TongTien { get; set; }
        public string TrangThai { get; set; }
        public string? PhuongThucThanhToan { get; set; }
        public string KieuBanHang { get; set; }

    }

}
