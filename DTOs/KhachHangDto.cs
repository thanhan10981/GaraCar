using Microsoft.AspNetCore.Http;

namespace GaraCarAPI.DTOs
{
    public class KhachHangDto
    {
        public string? MaKhachHang { get; set; }

        public string? TenKhachHang { get; set; }

        public string? SoDienThoai { get; set; }

        public string? Email { get; set; }

        public string? DiaChi { get; set; }

        public string? NgaySinh { get; set; }

        public string? GioiTinh { get; set; }

        public string? LoaiKhach { get; set; }

        public string? MaSoThue { get; set; }

        public string? CmndCccd { get; set; }

        public string? Facebook { get; set; }

        public string? GhiChu { get; set; }
        public string? TrangThai { get; set; }
        public string? NguoiTao { get; set; }
        public DateTime NgayTao { get; set; }

        public IFormFile? HinhAnh { get; set; }
    }
}
