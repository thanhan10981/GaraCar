using System.ComponentModel.DataAnnotations;

namespace GaraCarAPI.Models
{
    public class SoQuy
    {
        [Key]
        public string MaPhieu { get; set; }       // Mã phiếu
        public DateTime ThoiGian { get; set; }     // Thời gian
        public decimal GiaTri { get; set; }        // Giá trị
        public string NguoiNhan { get; set; }      // Người nhận
        public string SoDienThoai { get; set; }    // Số điện thoại
        public string DiaChi { get; set; }         // Địa chỉ
        public string LoaiThuChi { get; set; }     // Loại thu chi
        public string TrangThai { get; set; }      // Trạng thái
        public string NguoiTao { get; set; }       // Người tạo
        public string NhanVien { get; set; }       // Nhân viên
        public string DoiTuongNhan { get; set; }   // Đối tượng nhận
        public string GhiChu { get; set; }         // Ghi chú
    }
}
