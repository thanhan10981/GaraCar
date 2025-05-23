using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class NhapHang
    {
        [Key]
        public string MaNhapHang { get; set; }
        public string MaSanPham { get; set; }
        public string MaNCC { get; set; }
        public string Soluong { get; set; }
        public DateTime ThoiGianTao { get; set; }
        public string TrangThai { get; set; }
        public decimal TienNhap { get; set; }

        public SanPham SanPham { get; set; }
        public NhaCungCap NhaCungCap { get; set; }
    }
}
