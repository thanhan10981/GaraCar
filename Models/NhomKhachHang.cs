using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class NhomKhachHang
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string TenNhom { get; set; }

        public decimal GiamGia { get; set; }

        public string? GhiChu { get; set; }
        public ICollection<KhachHang>? KhachHangs { get; set; }
    }
}
