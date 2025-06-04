using GARA.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GaraCarAPI.Models
{
    public class HoaDon
    {
        [Key]
        public string MaHoaDon { get; set; }
        [ForeignKey("MaKhachHang")]
        public string MaKhachHang { get; set; }
        [ForeignKey("NhanVien")]
        public string MaNhanVien { get; set; }
        public DateTime ThoiGian { get; set; }
        public DateTime NgayGiaoDuKien { get; set; }
        public string NguoiBan { get; set; }
        public string TrangThai { get; set; }
        public string GhiChu { get; set; }
        public decimal PhuThu { get; set; }
        public string? KieuBanHang { get; set; }
        public decimal TongTien { get; set; }
        public string PhuongThucThanhToan { get; set; }
        public ICollection<SanPhamHoaDon> SanPhamHoaDons { get; set; }
        public NhanVien? NhanVien { get; set; }
        public KhachHang? KhachHang { get; set; }
        public ICollection<PhieuBaoHanh>? PhieuBaoHanhs { get; set; }
    }
}
// thay đổi hóa đơn bỏ mã sản phẩm đi để tạo thêm bảng sản phẩm khác để liên kết ( đéo có hiểu thì kệ mẹ tụi m)
