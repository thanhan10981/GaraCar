import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaiHang } from '../model/model.component';


@Injectable({
  providedIn: 'root'
})
export class LoaiHangService {
  private apiUrl = 'https://localhost:7037/api/LoaiHangs';

  constructor(private http: HttpClient) {}

  getAllLoaiHang(): Observable<LoaiHang[]> {
    return this.http.get<LoaiHang[]>(this.apiUrl);
  }
}
