using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace GaraCar.DTOs
{
    public class NhaCungCapDto
    {

        [Key]
        public string? MaNCC { get; set; }
        public string ?TenNCC { get; set; }
        public string ?SDT { get; set; }
        public string ?DiaChi { get; set; }
        public string ?PhuongXa { get; set; }
        public string? Email { get; set; }
        public string ?CongTy { get; set; }
        public string ?MaSoThue { get; set; }
        public string ?NhomNCC { get; set; }
        public string? NguoiTao { get; set; } // mới
        public DateTime NgayTao { get; set; } //mới
        public string ?TongTien { get; set; } //mới
        public string ?TrangThai { get; set; }
        public string? GhiChu { get; set; }
        [FromForm]
        public IFormFile? HinhAnh { get; set; }
    }
}
