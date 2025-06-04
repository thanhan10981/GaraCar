namespace GARA.DTOs
{
    public class BaoCaoNhaCungCapDTO
    {
        public string MaNCC { get; set; }
        public string TenNCC { get; set; }

        // Nhập hàng
        public decimal GiaTriNhap { get; set; }
        public decimal GiaTriTra { get; set; }
        public decimal GiaTriThuan => GiaTriNhap - GiaTriTra;

        // Công nợ
        public decimal NoDauKy { get; set; }
        public decimal NoCuoiKy => NoDauKy + GiaTriNhap - GiaTriTra;
        public string? GhiChu { get; set; }
        public decimal GhiNo { get; set; }

        // Hàng nhập chi tiết
        public int SoLuongNhap { get; set; }
        public int SoLuongTra { get; set; }
        public int SoLuongConLai => SoLuongNhap - SoLuongTra;
    }
}
