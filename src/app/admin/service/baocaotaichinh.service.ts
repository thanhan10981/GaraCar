import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaocaotaichinhService {

  private apiUrl = 'https://localhost:7037/api/bao-cao/tai-chinh';

  constructor(private http: HttpClient) { }

  getBaoCaoTaiChinh(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }
  exportBaoCaoTaiChinh(params: any) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return this.http.get('https://localhost:7037/api/bao-cao/tai-chinh/xuat-excel', {
      params: httpParams,
      responseType: 'blob'
    });
  }
  
}
