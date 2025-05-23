using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class SanPham
    {
        [Key]
        public string MaSanPham { get; set; }
        public string TenSanPham { get; set; }
        public string AvatarPath { get;set; }
        public string MaLoaiHang { get; set; }
        public decimal GiaBan { get; set; }
        public decimal GiaVon { get; set; }
        public int TonKho { get; set; }
        public DateTime ThoiGianTao { get; set; }
        public DateTime DuKienHetSanPham { get; set; }

        public LoaiHang LoaiHang { get; set; }
    }
}
