import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { YeuCauSuaChua, PaginationResponse } from '../model/model.component';

@Injectable({
  providedIn: 'root'
})
export class YeuCauSuaChuaService {
  private apiUrl = 'https://localhost:7037/api/YeuCauSuaChuas';

  constructor(private http: HttpClient) { }

  // Get all repair requests
  getAllYeuCauSuaChua(): Observable<YeuCauSuaChua[]> {
    return this.http.get<YeuCauSuaChua[]>(this.apiUrl);
  }

  // Get filtered repair requests
  getFilteredYeuCauSuaChua(
    search?: string,
    trangThai?: string,
    tuNgay?: Date,
    denNgay?: Date,
    page: number = 1,
    pageSize: number = 10
  ): Observable<PaginationResponse<YeuCauSuaChua>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) params = params.set('search', search);
    if (trangThai) params = params.set('trangThai', trangThai);
    if (tuNgay) params = params.set('tuNgay', tuNgay.toISOString());
    if (denNgay) params = params.set('denNgay', denNgay.toISOString());

    return this.http.get<PaginationResponse<YeuCauSuaChua>>(`${this.apiUrl}/filter`, { params });
  }

  // Get repair request by ID
  getYeuCauSuaChuaById(id: string): Observable<YeuCauSuaChua> {
    return this.http.get<YeuCauSuaChua>(`${this.apiUrl}/${id}`);
  }

  // Export to Excel
  exportYeuCauToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob'
    });
  }

  // Update repair request
  updateYeuCauSuaChua(id: string, data: YeuCauSuaChua): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Delete repair request
  deleteYeuCauSuaChua(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
} 
