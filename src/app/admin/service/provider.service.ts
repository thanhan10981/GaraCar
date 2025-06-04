import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NhaCungCap, NhapHang } from '../model/model.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
private apiUrl = 'https://localhost:7037/api/NhaCungCaps';

  constructor(private http: HttpClient) {}

  getAll(): Observable<NhaCungCap[]> {
    return this.http.get<NhaCungCap[]>(`${this.apiUrl}/all`);
  }

  getFilteredProviders(params: any): Observable<{ data: NhaCungCap[]; total: number }> {
    const queryParams = new HttpParams({ fromObject: params });
    return this.http.get<{ data: NhaCungCap[]; total: number }>(this.apiUrl, { params: queryParams });
  }

  getById(id: string): Observable<NhaCungCap> {
    return this.http.get<NhaCungCap>(`${this.apiUrl}/${id}`);
  }

  add(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  exportToExcel(): Observable<Blob> {
  return this.http.get('https://localhost:7037/api/NhaCungCaps/export', {
    responseType: 'blob'  
  });
  
}
downloadTemplate(): Observable<Blob> {
  return this.http.get('https://localhost:7037/api/NhaCungCaps/download-template', {
    responseType: 'blob'
  });
}
importNhaCungCap(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post('https://localhost:7037/api/NhaCungCaps/import', formData);
}
getAllPaginated(page: number, pageSize: number): Observable<{ data: any[], total: number }> {
  return this.http.get<{ data: any[], total: number }>(
    `https://localhost:7037/api/NhaCungCaps?page=${page}&pageSize=${pageSize}`
  );
}
getNhomNCCs(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/nhom-nccs`);
}
getNhapHangByMaNCC(maNcc: string): Observable<NhapHang[]> {
  return this.http.get<NhapHang[]>(`https://localhost:7037/api/NhapHangs/by-ncc/${maNcc}`);
}
exportNhapHang(maNCC: string): Observable<Blob> {
  const params = new HttpParams().set('maNCC', maNCC);
  return this.http.get(`https://localhost:7037/api/NhapHangs/xuat-lich-su-nhap`, {
    params,
    responseType: 'blob'
  });
}






}
