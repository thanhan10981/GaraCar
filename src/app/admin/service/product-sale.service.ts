import { HttpClient,} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { SanPham } from '../model/model.component';

@Injectable({
  providedIn: 'root'
})
export class ProductSaleService {
private apiUrl = 'https://localhost:7037/api/SanPhams';
 constructor(private http: HttpClient) {}

  getAllProducts(): Observable<SanPham[]> {
    return this.http.get<SanPham[]>(this.apiUrl);
  }
}
