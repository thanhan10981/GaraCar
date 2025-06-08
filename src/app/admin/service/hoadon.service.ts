import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HoaDon, BaoCaoHoaDon, HoaDonUpdate, PaginationResponse } from '../model/model.component';

@Injectable({
  providedIn: 'root',
})
export class HoaDonService {
  private apiUrl = 'https://localhost:7037/api/HoaDons';
  private baoCaoUrl = 'https://localhost:7037/api/BaoCaoHoaDon';

  constructor(private http: HttpClient) {}

  // ✅ GET All (nếu cần lấy toàn bộ)
  getAll(): Observable<HoaDon[]> {
    return this.http.get<HoaDon[]>(this.apiUrl);
  }

  // ✅ GET by ID
  getById(id: string): Observable<HoaDon> {
    return this.http.get<HoaDon>(`${this.apiUrl}/${id}`);
  }

  // ✅ PUT - Cập nhật
  update(id: string, data: HoaDonUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // ✅ DELETE
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ✅ GET với Lọc + Phân trang
  getFilteredHoaDons(filters: {
    search?: string;
    trangThai?: string;
    tuNgay?: string;
    denNgay?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PaginationResponse<HoaDon>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.http.get<PaginationResponse<HoaDon>>(`${this.apiUrl}/filter`, { params });
  }

  // ✅ Export Excel (với điều kiện lọc)
  exportExcel(filters: {
    search?: string;
    trangThai?: string;
    tuNgay?: string;
    denNgay?: string;
  }): Observable<Blob> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob',
    });
  }

  // ✅ Báo cáo tổng hợp hóa đơn (dành cho biểu đồ/ báo cáo cuối ngày...)
  getTongHopHoaDon(): Observable<BaoCaoHoaDon[]> {
    return this.http.get<BaoCaoHoaDon[]>(`${this.baoCaoUrl}/hoa-don-tong-hop`);
  }
}
