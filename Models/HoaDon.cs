using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class HoaDon
    {
        [Key]
        public string MaHoaDon { get; set; }
        public string MaSanPham { get; set; }
        public string MaKhachHang { get; set; }
        public int SoLuong { get; set; }
        public DateTime ThoiGian { get; set; }
        public DateTime NgayGiaoDuKien { get; set; }
        public string NguoiBan { get; set; }
        public string TrangThai { get; set; }
        public string? GhiChu { get; set; }
        public decimal PhuThu { get; set; }  

        public decimal TongTien { get; set; }

        public SanPham? SanPham { get; set; }
        public KhachHang? KhachHang { get; set; }
        public ICollection<PhieuBaoHanh>? PhieuBaoHanhs { get; set; }
    }
}
