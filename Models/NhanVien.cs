using System;
using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class NhanVien
    {
        [Key]
        public string MaNhanVien { get; set; }
        public string TenNhanVien { get; set; }
        public string SoDienThoai { get; set; }
        public DateTime NgaySinh { get; set; }
        public string GioiTinh { get; set; }
        public string DiaChi { get; set; }
        public DateTime NgayBatDau { get; set; }
        public string ChucVu { get; set; }
        public string TaiKhoanDangNhap { get; set; }
        public string CmndCccd { get; set; }
        public string Email { get; set; }
        public string Facebook { get; set; }
        public string HinhAnh { get; set; }
        public string GhiChu { get; set; }
    }
}
