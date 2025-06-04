import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KhachHang } from '../model/model.component';

@Injectable({
  providedIn: 'root',
})
export class KhachHangService {
  private apiUrl = 'https://localhost:7037/api/KhachHangs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<KhachHang[]> {
    return this.http.get<KhachHang[]>(this.apiUrl);
  }

  // 🔍 Tìm kiếm khách hàng theo từ khóa
  searchKhachHang(keyword: string): Observable<KhachHang[]> {
  return this.http.get<KhachHang[]>(`/api/khachhang/search?keyword=${encodeURIComponent(keyword)}`);
}
}
