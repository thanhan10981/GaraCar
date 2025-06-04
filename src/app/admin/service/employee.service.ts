import { Injectable } from '@angular/core';
import { NhanVien } from '../model/model.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7037/api/NhanViens';

  constructor(private http: HttpClient) {}
   getAll(): Observable<NhanVien[]> {
    return this.http.get<NhanVien[]>(this.apiUrl);
  }
  createNhanVien(formData: FormData) {
    return this.http.post(this.apiUrl, formData);
  }
  updateNhanVien(id: string, formData: FormData) {
  return this.http.put(`https://localhost:7037/api/NhanViens/${id}`, formData);
}
deleteNhanVien(maNhanVien: string) {
  return this.http.delete(`https://localhost:7037/api/NhanViens/${maNhanVien}`);
}
login(formData: FormData) {
  return this.http.post('https://localhost:7037/api/NhanViens/dang-nhap', formData);
}



}
