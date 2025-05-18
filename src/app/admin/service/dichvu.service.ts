import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DichVu } from '../model/model.component';


@Injectable({
  providedIn: 'root', // ✅ Phải có
})
export class DichVuService {
  private apiUrl = 'https://localhost:7293/api/DichVus';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DichVu[]> {
    return this.http.get<DichVu[]>(this.apiUrl);
  }

  add(dv: DichVu): Observable<DichVu> {
    return this.http.post<DichVu>(this.apiUrl, dv);
  }

  update(ma: string, dv: DichVu): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ma}`, dv);
  }

  delete(ma: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ma}`);
  }
}
