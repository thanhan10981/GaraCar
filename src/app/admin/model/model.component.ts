
export interface HoaDon {
    maHoaDon: string;
    maSanPham: string;
    maKhachHang: string;
    soLuong: number;
    thoiGian: Date;
    ngayGiaoDuKien: Date;
    nguoiBan: string;
    trangThai: string;
    ghiChu: string;
    tongTien: number;
  }
  export interface DichVu {
    maDichVu: string;
    tenDichVu: string;
    donGia: number;
}
export interface BaoCaoHoaDon {
  Loai: string;
  MaHoaDon: string;
  ThoiGian: string;
  KhachHang: string;
  NhanVien: string;
  TongTien: number;
  TrangThai: string;
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
  MaNhaCungCap: string;   
  TenNhaCungCap: string;  
  DienThoai: string;     
  DiaChi: string;         
  phuongXa: string;      
  Email: string;          
  CongTy: string;         
  MaSoThue: string;       
  NhomNCC: string;        
  GhiChu: string; 
  HinhAnh: string;          
}
export interface NhanVien {
  MaNhanVien: string;      
  TenNhanVien: string;     
  DienThoai: string;       
  NgaySinh: Date;          
  GioiTinh: string;        
  DiaChi: string;          
  NgayBatDau: Date;        
  ChucDanh: string;        
  TaiKhoanDangNhap: string;
  CmndCccd: string;        
  Email: string;           
  Facebook: string;        
  GhiChu: string;          
  HinhAnh: string;         
}
export interface SoQuy {
  MaPhieu: string;         
  ThoiGian: Date;          
  GiaTri: number;          
  NguoiNhan: string;       
  SoDienThoai: string;     
  DiaChi: string;          
  LoaiThuChi: string;      
  TrangThai: string;       
  NguoiTao: string;        
  NhanVien: string;        
  DoiTuongNhan: string;   
  GhiChu: string;          
}







