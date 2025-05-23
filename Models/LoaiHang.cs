using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class LoaiHang
    {
        [Key]
        public string MaLoaiHang { get; set; }
        public string TenLoaiHang { get; set; }
    }
}
