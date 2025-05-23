using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class PhieuBaoHanh
    {
        [Key]
        public string MaPhieuBaoHanh { get; set; }
        public string MaSanPham { get; set; }
        public string MaHoaDon { get; set; }
        public string MaKhachHang { get; set; }
        public DateTime ThoiGianBaoHanh { get; set; }

        public SanPham SanPham { get; set; }
        public HoaDon HoaDon { get; set; }
        public KhachHang KhachHang { get; set; }
    }
}
