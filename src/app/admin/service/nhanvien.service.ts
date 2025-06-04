import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NhanVien } from '../model/model.component';

@Injectable({
  providedIn: 'root'
})
export class NhanVienService {
  private apiUrl = 'https://localhost:7037/api/NhanViens';

  constructor(private http: HttpClient) {}

  getAllNhanViens(): Observable<NhanVien[]> {
    return this.http.get<NhanVien[]>(this.apiUrl);
  }
}
