using GaraCarAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace GARA.Models
{
    public class SanPhamHoaDon
    {
        [Key]
        public string MaSPHD { get; set; }
        public string MaSanPham { get; set; }
        public string MaHoaDon { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public virtual HoaDon HoaDon { get; set; }
        public virtual SanPham SanPham { get; set; }
    }
}
