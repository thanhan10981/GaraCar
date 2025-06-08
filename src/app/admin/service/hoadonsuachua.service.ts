import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HoaDonSuaChua, HoaDonSuaChuaUpdate, PaginationResponse } from '../model/model.component';

@Injectable({
  providedIn: 'root'
})
export class HoaDonSuaChuaService {
  private apiUrl = 'https://localhost:7037/api/HoaDonSuaChuas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<HoaDonSuaChua[]> {
    return this.http.get<HoaDonSuaChua[]>(this.apiUrl);
  }

  getById(id: string): Observable<HoaDonSuaChua> {
    return this.http.get<HoaDonSuaChua>(`${this.apiUrl}/${id}`);
  }

  add(data: HoaDonSuaChua): Observable<HoaDonSuaChua> {
    return this.http.post<HoaDonSuaChua>(this.apiUrl, data);
  }

  update(id: string, data: HoaDonSuaChuaUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  filterHoaDonSuaChua(filters: {
    search?: string;
    trangThai?: string;
    tuNgay?: string;
    denNgay?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PaginationResponse<HoaDonSuaChua>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.http.get<PaginationResponse<HoaDonSuaChua>>(`${this.apiUrl}/filter`, { params });
  }

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
}
