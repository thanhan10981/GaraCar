
export interface HoaDon {
  MaHoaDon: string;
  MaKhachHang: string;
  TenKhachHang: string;
  MaNhanVien: string;
  TenNhanVien: string;
  ThoiGian: string;
  NgayGiaoDuKien: string;
  NguoiBan: string;
  TrangThai: string;
  GhiChu: string;
  PhuThu: string;
  KieuBanHang: string; // Thêm kiểu bán hàng (Hân)
  PhuongThucThanhToan: string; // Thêm phương thức thanh toán (Hân)
  TongTien: string;
}
export interface HoaDonUpdate {
  MaHoaDon: string;
  MaKhachHang: string;
  MaNhanVien: string;
  ThoiGian: string;
  NgayGiaoDuKien: string;
  NguoiBan: string;
  TrangThai: string;
  GhiChu: string;
  PhuThu: string;
  KieuBanHang: string;
  PhuongThucThanhToan: string;
  TongTien: string;
}

export interface DichVu {
  MaDichVu: string;
  TenDichVu: string;
  DonGia: string;
}
export interface BaoCaoHoaDon {
Loai: string;
MaHoaDon: string;
ThoiGian: Date;//sửa lại date để t lọc đc (Hân)
KhachHang: string;
NhanVien: string;
TongTien: number;
TrangThai: string;
PhuongThucThanhToan:string;// thêm pth vào(hân)

}
// thêm báo cáo thu chi vào để làm báo cáo thu chi cuối ngày 
export interface BaoCaoThuChi {
MaPhieu: string;
ThoiGian: Date;
LoaiThuChi: string;
GiaTri: number;
NguoiNhan: string;
NguoiTao: string;
NhanVien: string;
GhiChu: string;
PhuongThucThanhToan:string;
}

export interface KhachHang {
MaKhachHang: string;        
TenKhachHang: string;      
SoDienThoai?: string;         
NgaySinh?: string;          
GioiTinh?: string;    
DiaChi?: string;            
LoaiKhach: string; 
MaSoThue?: string;          
CmndCccd?: string;          
Email?: string;             
Facebook?: string;         
GhiChu?: string;           
HinhAnh?: string; 
TrangThai?:String;
NguoiTao?:String; 
NgayTao?:string;   
selected?: boolean;      
}
export interface NhaCungCap {
MaNCC: string;   
TenNCC: string;  
SDT: string;     
DiaChi: string;         
phuongXa: string;      
Email: string;          
CongTy: string;         
MaSoThue: string;       
NhomNCC: string;
NguoiTao:string;
NgayTao: string;
TongTien:string;  
TrangThai:string,      
GhiChu: string; 
HinhAnh: string; 
selected?: boolean;            
}
export interface NhanVien {
MaNhanVien: string;      
TenNhanVien: string;     
SoDienThoai: string;       
NgaySinh: string;          
GioiTinh: string;        
DiaChi: string;          
NgayBatDau: string;        
ChucVu: string;        
TaiKhoanDangNhap: string;
MatKhau: string;        
CmndCccd: string;           
Email: string;        
Facebook: string;          
HinhAnh: string;    
GhiChu: string;  
TrangThai:string         
}
export interface SoQuy {
MaPhieu: string;         
ThoiGian: string;          
GiaTri: string;          
NguoiNhan: string;       
SoDienThoai: string;     
DiaChi: string;          
LoaiThuChi: string;      
TrangThai: string;       
NguoiTao: string;        
NhanVien: string;        
DoiTuongNhan: string;   
GhiChu: string;  
PhuongThucThanhToan:string;        
}
export interface NhapHang {
MaNhapHang: string; 
MaSanPham: string;         
MaNCC: string;       
TenSanPham: string;          
TenNCC: string;          
SoLuong: string;       
ThoiGianTao: string;     
TrangThai: string;          
TienNhap: string;      
NguoiTao: string;   
TienNo:string ;        
}
export interface NhapHangUpdate {
MaNhapHang: string;
MaSanPham: string;
MaNCC: string;
SoLuong: string;
ThoiGianTao: string;
TrangThai: string;
TienNhap: number;
TienNo: number;
NguoiTao: string;
}

export interface SanPham {
MaSanPham: string;         
TenSanPham: string;          
AvatarPath: string;          
MaLoaiHang: string;       
GiaBan: string;     
GiaVon: string;          
TonKho: string;      
ThoiGianTao: string;   
DuKienHetSanPham:string ;        
LoaiHang:string ;        
}
export interface DoanhThuPhuTung {
Ngay: string;
TongTien: number;
}
export interface LoiNhuanPhuTung {
Ngay: string;
LoiNhuan: number;
}
export interface SanPhamChiTiet {
TenSanPham: string;
SoLuong: number;
DonGia: number;
GiaVon: number;
ThanhTien: number;
LoiNhuan: number;
}
export interface DoanhThuLoiNhan {
Ngay: string;
SoLuongDon: number;
DoanhThu: number;
GiaVon: number;
PhuThu: number;
LoiNhuan: number;
}
export interface DoanhThuLoiNhuanResponse {
Data: DoanhThuLoiNhan[];
TongSoLuongDon: number;
TongGiaVon: number;
TongDoanhThu: number;
TongPhuThu: number;
TongLoiNhuan: number;
}
export interface TopNhanVien {
MaNhanVien: string;
TenNhanVien: string;
TongDoanhThu: number;
TongGiaVon: number;
TongPhuThu: number;
TongLoiNhuan: number;
}
export interface LoaiHang {
MaLoaiHang: string;
TenLoaiHang: string;
}
// dùng cho mục bán hàng ở báo cáo hàng hóa
export interface BaoCaoHangHoaBanHang {
MaSanPham: string;
TenSanPham: string;
SoLuongBan: number;
SoLuongSua: number;
TongSoLuong: number;
GiaVon:number;
DoanhThu: number;
LoiNhuan:number;
}

export interface BaoCaoHangHoaGiaTriKho {
MaSanPham: string;
TenSanPham: string;
TonKho: number;
GiaVon: number;
GiaTriTon: number;
}
export interface BaoCaoHangHoaXuatNhapTon {
MaSanPham: string;
TenSanPham: string;
SoLuongNhap: number;
SoLuongBan: number;
SoLuongSua: number;
TonKho: number;
TonDau:number;
}
export interface BaoCaoHangHoaNhaCungCapNhap {
MaNCC: string;
NhomNCC: string;
TenNCC: string;
TenSanPham: string;
TongSoLuong: number;
TienNhap: number;
TongTien: number;
}
export interface HoaDonSuaChuaUpdate {
MaHoaDon: string;
MaYeuCau: string;
MaNhanVien: string;
NgayLap: string;
ThoiGianHoanThanhDuKien: string;
TrangThai: string;
TongTien: number;
PhuongThucThanhToan: string;
}
export interface HoaDonSuaChua {
MaHoaDon: string;
MaYeuCau: string;
MaNhanVien: string;
NgayLap: string;
ThoiGianHoanThanhDuKien: string;
TrangThai: string;
TongTien: number;
PhuongThucThanhToan: string;
TenNhanVien: string;
TenYeuCau: string;
}

export interface YeuCauSuaChua {
  MaYeuCau: string;
  BienSoXe: string;
  NgayDat: Date;
  ThoiGianTao: Date;
  MoTa: string;
  TrangThai: string;
}
