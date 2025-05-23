using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class KhachHang
    {
        [Key]
        public string ?MaKhachHang { get; set; }

        [Required]
        public string ?TenKhachHang { get; set; }

        public string ?SoDienThoai { get; set; }

        public string? Email { get; set; }

        public string ?DiaChi { get; set; }
        public string? NgaySinh { get; set; }

        public string ?GioiTinh { get; set; } 

        public string ?LoaiKhach { get; set; } 

        public string ?MaSoThue { get; set; }

        public string ?CmndCccd { get; set; }

        public string ?Facebook { get; set; }

        public string ?GhiChu { get; set; }
        public string? HinhAnh { get; set; }
        public string? TrangThai { get; set; }
        public string? NguoiTao { get; set; }
        public DateTime NgayTao { get; set; }

        // Quan hệ
        public ICollection<XeKhachHang>? XeKhachHangs { get; set; }

        public ICollection<HoaDon>? HoaDons { get; set; }
    }
}
