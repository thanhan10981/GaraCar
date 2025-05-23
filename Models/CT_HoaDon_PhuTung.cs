namespace GaraCarAPI.Models
{
    public class CT_HoaDon_PhuTung
    {
        public string MaHoaDon { get; set; }
        public string MaSanPham { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }

        public HoaDonSuaChua HoaDonSuaChua { get; set; }
        public SanPham SanPham { get; set; }
    }
}
