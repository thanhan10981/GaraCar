using Microsoft.AspNetCore.Mvc;

namespace GaraCar.DTOs
{
    public class NhanVienDto
    {
        public string ?MaNhanVien { get; set; }
        public string ?TenNhanVien { get; set; }
        public string ?SoDienThoai { get; set; }
        public string ?NgaySinh { get; set; }
        public string ?GioiTinh { get; set; }
        public string ?DiaChi { get; set; }
        public string ?NgayBatDau { get; set; }
        public string ?ChucVu { get; set; }
        public string ?TaiKhoanDangNhap { get; set; }
        public string ?MatKhau { get; set; }
        public string ?CmndCccd { get; set; }
        public string ?Email { get; set; }
        public string ?Facebook { get; set; }
        [FromForm]
        public IFormFile? HinhAnh { get; set; }
        public string ?TrangThai { get; set; }
        public string ?GhiChu { get; set; }
    }
}
