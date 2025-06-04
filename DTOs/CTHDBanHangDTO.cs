namespace GARA.DTOs
{
    public class CTHDBanHangDTO
    {
        public string MaHoaDon { get; set; }
        public DateTime ThoiGian { get; set; }
        public string TenKhachHang { get; set; }
        public string SoDienThoai { get; set; }
        public string Email { get; set; }

        public List<SanPhamDTO> SanPham { get; set; }
    }
    public class SanPhamDTO
    {
        public string TenSanPham { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }
}
