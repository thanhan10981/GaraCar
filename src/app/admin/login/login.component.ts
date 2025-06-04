import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NhanVien } from '../model/model.component';
import { EmployeeService } from '../service/employee.service';
import { Router, RouterModule} from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginAdminComponent {
 Employees :NhanVien[] = [];
 Employee :NhanVien = this.getEmptyEmployee(); 
 thongBao: string = '';
thanhCong: boolean = false;
hienMatKhau: boolean = false;

constructor(private router: Router, private EmployeeService:EmployeeService){}

ngOnInit(): void {
  this.getAllEmployee();
}
 getAllEmployee() {
  this.EmployeeService.getAll().subscribe(res => {
    this.Employees = res;

  });
}
onLogin(c:string) {
  if (!this.Employee.TaiKhoanDangNhap || !this.Employee.MatKhau) {
    this.thongBao = 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!';
      this.thanhCong = true;
      setTimeout(() => this.thanhCong = false, 1000);
    return;
  }
  const formData = new FormData();
  formData.append('TaiKhoanDangNhap', this.Employee.TaiKhoanDangNhap);
  const rawPassword = this.Employee.MatKhau || ''; // nếu undefined thì gán chuỗi rỗng
  const hashedPassword = CryptoJS.SHA256(rawPassword).toString(CryptoJS.enc.Hex); // mã hóa rõ định dạng
  formData.append('MatKhau', hashedPassword);
  this.EmployeeService.login(formData).subscribe({
   next: (res) => {
  this.thongBao = '🎉 Đăng nhập thành công!';
  this.thanhCong = true;
  setTimeout(() => {
    this.thongBao = '';
    this.thanhCong = false;
    localStorage.setItem('user', JSON.stringify(res));
    const user = res as any;
    localStorage.setItem('TenNhanVien', user.tenNhanVien);
    if(c === "admin"){
    this.router.navigate(['/admin/overview']);
  }else{
      this.router.navigate(['/admin/productSale'])
    }
  }, 2000); // Chờ 2s để người dùng thấy rõ
},
    error: (err) => {
      this.thongBao = '❌ Sai tài khoản hoặc mật khẩu!';
      this.thanhCong = true;
      setTimeout(() => this.thanhCong = false, 1000);
     
    }
  });
}

  getEmptyEmployee(){
    return{
      MaNhanVien: '',     
      TenNhanVien: '',   
      SoDienThoai: '',       
      NgaySinh:'' ,          
      GioiTinh: '',        
      DiaChi:'' ,          
      NgayBatDau: '',      
      ChucVu:'' ,        
      TaiKhoanDangNhap:'' ,
      MatKhau: '',        
      CmndCccd:'' ,           
      Email: '',       
      Facebook:'' ,          
      HinhAnh: '',   
      GhiChu: '',   
      TrangThai:''      
    }
  }
}
