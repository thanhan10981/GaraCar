import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password', 
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  thongBao: string = '';
  thanhCong: boolean = false;
  otpGuiThanhCong = false;
  constructor(private authService: AuthService) {}

  guiOtp() {
    debugger
    if (!this.email) {
      this.thongBao = 'Vui lòng nhập email!';
      this.thanhCong = false;
      return;
    }
    this.authService.sendOtp(this.email).subscribe({
      next: (res: any) => {
        this.thongBao = '✅ Mã OTP đã được gửi đến email!';
        this.thanhCong = true;
        this.otpGuiThanhCong = true; 
      },
    error: (err) => {
    console.error('Lỗi:', err);

    if (err.status === 404) {
      this.thongBao = 'Email không tồn tại!';
    } else {
      this.thongBao = 'Email không tồn tại hoặc lỗi máy chủ!';
    }

    this.thanhCong = false;
  }

    });
  }
  // Gửi OTP + mật khẩu mới
otp: string = '';
newPassword: string = '';

datLaiMatKhau() {
  const req = {
    email: this.email,
    otpCode: this.otp,
    newPassword: this.newPassword
  };

  this.authService.resetPassword(req).subscribe({
    next: () => {
      this.thongBao = '✅ Mật khẩu đã được đặt lại!';
      this.thanhCong = true;

      // ⏱️ Chuyển về đăng nhập sau 3 giây
      setTimeout(() => {
        location.href = '/admin/login';
      }, 3000);
    },
    error: (err) => {
      console.error('❌ Lỗi đặt lại mật khẩu:', err);

      // ✅ Hiển thị lỗi từ backend (nếu có)
      if (err.error && typeof err.error === 'string') {
        this.thongBao = err.error;
      } else if (err.error?.message) {
        this.thongBao = err.error.message;
      } else {
        this.thongBao = '❌ Có lỗi xảy ra khi đặt lại mật khẩu.';
      }

      this.thanhCong = false;
    }
  });
}

}
