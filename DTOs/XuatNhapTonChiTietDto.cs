namespace GaraCar.DTOs
{
    public class XuatNhapTonChiTietDto
    {
        public DateTime Ngay { get; set; }
        public string Loai { get; set; } = string.Empty;
        public string TenSanPham { get; set; } = string.Empty;
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien { get; set; }
    }
}
