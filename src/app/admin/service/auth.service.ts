import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  // 📤 Gửi email để nhận OTP
  sendOtp(email: string) {
  return this.http.post(
    'https://localhost:7037/api/Auth/gui-otp',
    JSON.stringify(email), // 👈 Gửi chuỗi JSON thuần
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
resetPassword(data: any) {
  return this.http.post('https://localhost:7037/api/Auth/dat-lai-mat-khau-otp', data);
}


}
