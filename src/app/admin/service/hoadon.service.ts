import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaoCaoHoaDon, HoaDon } from '../model/model.component';


@Injectable({
  providedIn: 'root',
})
export class HoaDonService {
  private apiUrl = 'https://localhost:7293/api/HoaDons';
  private baoCaoUrl = 'https://localhost:7054/api/BaoCaoHoaDon';// code của hân
  constructor(private http: HttpClient) {}

  getAll(): Observable<HoaDon[]> {
    return this.http.get<HoaDon[]>(this.apiUrl);
  }

  getById(id: string): Observable<HoaDon> {
    return this.http.get<HoaDon>(`${this.apiUrl}/${id}`);
  }

  add(data: HoaDon): Observable<HoaDon> {
    return this.http.post<HoaDon>(this.apiUrl, data);
  }

  update(id: string, data: HoaDon): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
   // 🔹 Báo cáo tổng hợp hóa đơn - code của hân
  getTongHopHoaDon(): Observable<BaoCaoHoaDon[]> {
    return this.http.get<BaoCaoHoaDon[]>(`${this.baoCaoUrl}/hoa-don-tong-hop`);
  }
}
