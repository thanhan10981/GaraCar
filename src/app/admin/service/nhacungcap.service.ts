import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NhaCungCap } from '../model/model.component';


@Injectable({
  providedIn: 'root'
})
export class NhaCungCapService {
  private apiUrl = 'https://localhost:7037/api/NhaCungCaps';

  constructor(private http: HttpClient) {}

  getAllNhaCungCap(): Observable<NhaCungCap[]> {
    return this.http.get<NhaCungCap[]>(this.apiUrl);
  }
  exportBaoCaoNhaCungCap(filter: any) {
    let params = new HttpParams();
    Object.keys(filter).forEach(key => {
      if (filter[key] !== null && filter[key] !== undefined && filter[key] !== '') {
        params = params.set(key, filter[key]);
      }
    });

    return this.http.get('https://localhost:7037/api/bao-cao/nha-cung-cap/xuat-excel', {
      params: params,
      responseType: 'blob'
    });
}
}
