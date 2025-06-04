namespace GARA.DTOs
{
    public class DoanhThuLoiNhuanDTO
    {
        public string Ngay { get; set; }
        public int SoLuongDon { get; set; }
        public decimal DoanhThu { get; set; }
        public decimal GiaVon { get; set; }
        public decimal PhuThu { get; set; }
        public decimal LoiNhuan => DoanhThu - GiaVon + PhuThu;
    }
    public class DoanhThuLoiNhuanResponse
    {
        public List<DoanhThuLoiNhuanDTO> Data { get; set; } = new();
        public int TongSoLuongDon { get; set; }
        public decimal TongGiaVon { get; set; }
        public decimal TongDoanhThu { get; set; }
        public decimal TongPhuThu { get; set; }
        public decimal TongLoiNhuan { get; set; }
    }
}
