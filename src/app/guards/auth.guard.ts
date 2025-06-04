import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      return true;
    } else {
      // Nếu chưa đăng nhập, chuyển về trang login
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}
