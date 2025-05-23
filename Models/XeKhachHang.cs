using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class XeKhachHang
    {
        [Key]
        public string BienSoXe { get; set; }
        public string MaKhachHang { get; set; }
        public string TenXe { get; set; }

        public KhachHang? KhachHang { get; set; }
        public ICollection<YeuCauSuaChua> YeuCauSuaChuas { get; set; }

    }
}
