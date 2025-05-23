using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class HoaDonSuaChua
    {
        [Key]
        public string MaHoaDon { get; set; }
        public string MaYeuCau { get; set; }
        public string MaNhanVien { get; set; }
        public DateTime NgayLap { get; set; }
        public DateTime ThoiGianHoanThanhDuKien { get; set; }
        public string TrangThai { get; set; }
        public decimal TongTien { get; set; }

        public YeuCauSuaChua? YeuCauSuaChua { get; set; }
        public NhanVien NhanVien { get; set; }
        // mối quan hệ nhiều hóa đơn chi tiết phục vụ
        public ICollection<CT_HoaDon_DichVu> ?ChiTietDichVus { get; set; }
    }
}
