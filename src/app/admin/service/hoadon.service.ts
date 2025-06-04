import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaoCaoHoaDon, DoanhThuLoiNhuanResponse, DoanhThuPhuTung, HoaDon, LoiNhuanPhuTung, SanPhamChiTiet} from '../model/model.component';


@Injectable({
  providedIn: 'root',
})
export class HoaDonService {
  private apiUrl = 'https://localhost:7037/api/HoaDons';
  private baoCaoUrl = 'https://localhost:7037/api/BaoCaoHoaDon';// code của hân
  constructor(private http: HttpClient) {}

  getAll(): Observable<HoaDon[]> {
    return this.http.get<HoaDon[]>(this.apiUrl);
  }

  getById(id: string): Observable<HoaDon> {
    return this.http.get<HoaDon>(`${this.apiUrl}/${id}`);
  }

  add(data: HoaDon): Observable<HoaDon> {
    return this.http.post<HoaDon>(this.apiUrl, data);
  }

  update(id: string, data: HoaDon): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  //  🔹 Báo cáo tổng hợp hóa đơn - code của hân
  getTongHopHoaDon(params: any): Observable<{ TongSoHoaDon: number, TongTienTatCa: number, HoaDons: BaoCaoHoaDon[] }> {
  return this.http.get<{ TongSoHoaDon: number, TongTienTatCa: number, HoaDons: BaoCaoHoaDon[] }>(
    `${this.baoCaoUrl}/hoa-don-tong-hop`,
    { params }
  );
}

  getChiTietBanHang(maHoaDon: string): Observable<any> {
    return this.http.get<any>(`${this.baoCaoUrl}/chi-tiet-ban-hang/${maHoaDon}`);
  }
  getChiTietSuaChua(maHoaDon: string): Observable<any> {
    return this.http.get<any>(`${this.baoCaoUrl}/chi-tiet-sua-chua/${maHoaDon}`);
  }
  getThuChiTongHop(params: any): Observable<any> {
  return this.http.get(`${this.baoCaoUrl}/thu-chi-tong-hop`, { params }); 
  }
  getDoanhThuPhuTung(params: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baoCaoUrl}/doanh-thu-phu-tung`, { params });
  }
  getLoiNhuanPhuTung(params: HttpParams): Observable<LoiNhuanPhuTung[]> {
  return this.http.get<LoiNhuanPhuTung[]>(`${this.baoCaoUrl}/loi-nhuan-phu-tung`, { params });
}
getBaoCaoDoanhThuLoiNhuan(params: any): Observable<DoanhThuLoiNhuanResponse> {
  return this.http.get<DoanhThuLoiNhuanResponse>(`${this.baoCaoUrl}/bao-cao/doanh-thu-loi-nhuan`, { params });
}

getChiTietTheoKhoangNgay(tuNgay: string, denNgay: string): Observable<SanPhamChiTiet[]> {
  return this.http.get<SanPhamChiTiet[]>(`${this.baoCaoUrl}/bao-cao/Chi-Tiet-Theo-Ngay`, {
    params: {
      tuNgay: tuNgay,
      denNgay: denNgay
    }
  });
}
getBaoCaoTopNhanVien(params: any): Observable<any> {
  return this.http.get<any>(`${this.baoCaoUrl}/nhan-vien/bao-cao`, { params });
}

exportExcel(filter: any): Observable<Blob> {
  let params = new HttpParams();

  Object.keys(filter).forEach(key => {
    if (filter[key] !== null && filter[key] !== undefined && filter[key] !== '') {
      params = params.set(key, filter[key]);
    }
  });

  return this.http.get('https://localhost:7054/api/BaoCaoHoaDon/xuat-excel', {
    params,
    responseType: 'blob'
  });
}


}
