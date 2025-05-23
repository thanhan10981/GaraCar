using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class DichVu
    {
        [Key]
        public string MaDichVu { get; set; }
        public string TenDichVu { get; set; }
        public decimal DonGia { get; set; }
    }
}
