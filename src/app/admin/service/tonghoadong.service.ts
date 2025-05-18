import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaoCaoHoaDon } from '../model/model.component';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TonghoadongService {
  private apiUrl = 'https://localhost:7054/api/BaoCaoHoaDon/hoa-don-tong-hop';
  constructor(private http:HttpClient) { }
   getTongHopHoaDon(): Observable<BaoCaoHoaDon[]> {
    return this.http.get<BaoCaoHoaDon[]>(`${'https://localhost:7054/api/BaoCaoHoaDon/hoa-don-tong-hop'}/hoa-don-tong-hop`);
  }
}
