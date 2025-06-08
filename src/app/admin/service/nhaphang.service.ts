import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NhapHang, NhapHangUpdate, PaginationResponse } from '../model/model.component';

@Injectable({
  providedIn: 'root',
})
export class NhapHangService {
  private apiUrl = `https://localhost:7037/api/NhapHangs`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<NhapHang[]> {
    return this.http.get<NhapHang[]>(this.apiUrl);
  }

  getById(id: string): Observable<NhapHang> {
    return this.http.get<NhapHang>(`${this.apiUrl}/${id}`);
  }

  create(nhapHang: NhapHang): Observable<NhapHang> {
    return this.http.post<NhapHang>(this.apiUrl, nhapHang);
  }

  update(id: string, nhapHang: NhapHangUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, nhapHang);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  exportExcel(filters: {
    search?: string;
    trangThai?: string;
    tuNgay?: string;
    denNgay?: string;
  }): Observable<Blob> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob',
    });
  }

  getFiltered(params: {
    search?: string;
    trangThai?: string;
    tuNgay?: string;
    denNgay?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PaginationResponse<NhapHang>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<PaginationResponse<NhapHang>>(`${this.apiUrl}/filter`, { params: httpParams });
  }
}

function stripExtraFields(obj: any, allowedFields: string[]) {
  const result: any = {};
  allowedFields.forEach(field => {
    if (obj[field] !== undefined) result[field] = obj[field];
  });
  return result;
}
