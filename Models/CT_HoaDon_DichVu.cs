namespace GaraCarAPI.Models
{
    public class CT_HoaDon_DichVu
    {
        public string MaCTDV { get; set; }
        public string MaHoaDon { get; set; }
        public string MaDichVu { get; set; }
        public decimal DonGia { get; set; }

        public HoaDonSuaChua HoaDonSuaChua { get; set; }
        public DichVu DichVu { get; set; }
    }
}
