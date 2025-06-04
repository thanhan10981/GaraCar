namespace GARA.DTOs
{
    public class BaoCaoHangHoaBanHangDTO
    {
        public string MaSanPham { get; set; } = string.Empty;
        public string TenSanPham { get; set; } = string.Empty;
        public int SoLuongBan { get; set; } = 0;
        public int SoLuongSua { get; set; } = 0;
        public int TongSoLuong => SoLuongBan + SoLuongSua;

        public decimal DoanhThu { get; set; } = 0;
        public decimal GiaVon { get; set; } = 0;
        public decimal LoiNhuan => DoanhThu - GiaVon; 
    }


}
