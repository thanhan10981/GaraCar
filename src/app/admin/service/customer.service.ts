
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KhachHang } from '../model/model.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'https://localhost:7037/api/KhachHangs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<KhachHang[]> {
    return this.http.get<KhachHang[]>(this.apiUrl);
  }

  add(formData: FormData): Observable<KhachHang> {
    return this.http.post<KhachHang>(this.apiUrl, formData);
  }

  update(maKhachHang: string, customerData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${maKhachHang}`, customerData);
  }

  delete(maKhachHang: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${maKhachHang}`);
}

  getFilteredCustomers(filter: any) {
  return this.http.get<KhachHang[]>(this.apiUrl, {
    params: filter
  });
}


}


