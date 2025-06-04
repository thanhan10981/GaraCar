import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule,ReactiveFormsModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  showColorPicker = false;
  selectedColor = '#1B1E2C';
  colors = [
    '#007bff', '#4b6584', '#2ecc71',
    '#9b59b6', '#e74c3c', '#7f8c8d',
    '#16a085', '#e67e22', '#a2ade9'
  ];
  showForm = false;
  doiMatKhauVisible = false;
  hienMatKhau = false;

  userForm!: FormGroup;
  constructor(private router:Router) {}
  userRole= JSON.parse(localStorage.getItem('user') || '{}').ChucVu || '';
  userCode= JSON.parse(localStorage.getItem('user') || '{}').MaNhanVien || '';
  userName = JSON.parse(localStorage.getItem('user') || '{}').TenNhanVien || '';
ngOnInit(): void {

  }
openForm(){
  this.showForm = true;
}
closeForm(){
  this.showForm = false;
}
  toggleColorPicker() {
    this.showColorPicker = !this.showColorPicker;
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  toggleDoiMatKhau() {
    this.doiMatKhauVisible = !this.doiMatKhauVisible;
  }

  toggleHienMatKhau() {
    this.hienMatKhau = !this.hienMatKhau;
  }

  luuMatKhau() {
    const matKhauGroup = this.userForm.get('doiMatKhau')?.value;
    const { matKhauCu, matKhauMoi, matKhauMoiNhapLai } = matKhauGroup;

    if (matKhauMoi !== matKhauMoiNhapLai) {
      alert('Mật khẩu mới không trùng khớp!');
      return;
    }

    // Gửi mật khẩu mới đến server...
    console.log('Gửi mật khẩu:', matKhauCu, matKhauMoi);
  }
  logout(){
    localStorage.removeItem('user');
    this.router.navigate(['/admin/login']);
  }
}
