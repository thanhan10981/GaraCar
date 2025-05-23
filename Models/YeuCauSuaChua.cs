using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class YeuCauSuaChua
    {
        [Key]
        public string MaYeuCau { get; set; }
        public string BienSoXe { get; set; }
        public DateTime NgayDat { get; set; }
        public DateTime ThoiGianTao { get; set; }
        public string MoTa { get; set; }
        public string TrangThai { get; set; }

        public XeKhachHang? XeKhachHang { get; set; }
        public ICollection<HoaDonSuaChua>? HoaDonSuaChuas { get; set; }


    }
}
