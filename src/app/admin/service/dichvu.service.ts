import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DichVu, PaginationResponse } from '../model/model.component';

@Injectable({
  providedIn: 'root',
})
export class DichVuService {
  private apiUrl = 'https://localhost:7037/api/DichVus';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PaginationResponse<DichVu>> {
    return this.http.get<PaginationResponse<DichVu>>(`${this.apiUrl}`);
  }

  getById(id: string): Observable<DichVu> {
    return this.http.get<DichVu>(`${this.apiUrl}/${id}`);
  }

  add(data: DichVu): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: string, data: DichVu): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  filterDichVu(
    search?: string,
    searchType?: string,
    maDichVu?: string,
    tenDichVu?: string,
    giaMin?: number | null,
    giaMax?: number | null,
    page: number = 1,
    pageSize: number = 10
  ): Observable<PaginationResponse<DichVu>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) params = params.set('search', search);
    if (searchType) params = params.set('searchType', searchType);
    if (maDichVu) params = params.set('maDichVu', maDichVu);
    if (tenDichVu) params = params.set('tenDichVu', tenDichVu);
    if (giaMin !== null && giaMin !== undefined) params = params.set('giaMin', giaMin.toString());
    if (giaMax !== null && giaMax !== undefined) params = params.set('giaMax', giaMax.toString());

    return this.http.get<PaginationResponse<DichVu>>(`${this.apiUrl}`, { params });
  }

  exportFile(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob',
    });
  }
}
