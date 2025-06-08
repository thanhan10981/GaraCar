import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DichVu } from '../model/model.component';

@Injectable({
  providedIn: 'root',
})
export class DichVuService {
  private readonly apiUrl = 'https://localhost:7037/api/DichVus';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DichVu[]> {
    return this.http.get<DichVu[]>(this.apiUrl);
  }

  add(dv: DichVu): Observable<DichVu> {
    return this.http.post<DichVu>(this.apiUrl, dv);
  }

  update(maDichVu: string, dv: DichVu): Observable<DichVu> {
    return this.http.put<DichVu>(`${this.apiUrl}/${maDichVu}`, dv);
  }

  delete(maDichVu: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${maDichVu}`);
  }

  filterDichVu(
    search: string,
    searchType: string,
    maDichVu: string,
    tenDichVu: string,
    giamin: number | null,
    giamax: number | null
  ): Observable<DichVu[]> {
    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
      if (searchType) {
        params = params.set('searchType', searchType);
      }
    }

    if (maDichVu) {
      params = params.set('MaDichVu', maDichVu);
    }

    if (tenDichVu) {
      params = params.set('TenDichVu', tenDichVu);
    }

    if (giamin !== null) {
      params = params.set('giamin', giamin.toString());
    }

    if (giamax !== null) {
      params = params.set('giamax', giamax.toString());
    }

    return this.http.get<DichVu[]>(this.apiUrl, { params });
  }

  exportFile(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob',
    });
  }
}
