namespace GARA.DTOs
{
    public class CTHDSuaChuaDTO
    {
        public string MaHoaDon { get; set; }
        public DateTime NgayLap { get; set; }
        public string TenKhachHang { get; set; }
        public string BienSo { get; set; }
        public string TenNhanVien { get; set; }

        public List<DichVuDTO> ChiTietDichVus { get; set; }
        public List<PhuTungDTO> ChiTietPhuTungs { get; set; }
    }
    public class DichVuDTO
    {
        public string TenDichVu { get; set; }
        public decimal DonGia { get; set; }
    }
    public class PhuTungDTO
    {
        public string TenSanPham { get; set; }
        public decimal DonGia { get; set; }
        public int SoLuong { get; set; }
    }
}
