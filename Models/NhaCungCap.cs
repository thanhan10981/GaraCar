using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class NhaCungCap
    {
        [Key]
        public string MaNCC { get; set; }           
        public string TenNCC { get; set; }         
        public string SDT { get; set; }             
        public string DiaChi { get; set; }          
        public string PhuongXa { get; set; }        
        public string Email { get; set; }           
        public string CongTy { get; set; }         
        public string MaSoThue { get; set; }       
        public string NhomNCC { get; set; }         
        public string GhiChu { get; set; }
        public string HinhAnh { get; set; }  
    }
}
