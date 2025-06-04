import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaoCaoHangHoaBanHang, BaoCaoHangHoaGiaTriKho, BaoCaoHangHoaNhaCungCapNhap, BaoCaoHangHoaXuatNhapTon,BaoCaoNhaCungCapDTO } from '../model/model.component';

@Injectable({
  providedIn: 'root'
})
export class BaoCaoHangHoaService {
  private apiUrl = 'https://localhost:7037/api/bao-cao/hang-hoa';
   private apiNCCUrl = 'https://localhost:7037/api/bao-cao/nha-cung-cap';
  constructor(private http: HttpClient) {}

  //  Top 10 bán chạy
  getTopBanChay(params: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, {
      params: { ...params, moiQuanTam: 'ban-hang', kieuHienThi: 'chart', loaiBaoCao: 'ban-chay' }
    });
  }

  //  Top 10 tiêu thụ
  getTopTieuThu(params: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, {
      params: { ...params, moiQuanTam: 'ban-hang', kieuHienThi: 'chart', loaiBaoCao: 'tieu-thu' }
    });
  }

  //  Báo cáo bảng bán hàng
  getReportBanHang(filter: any): Observable<{tong: BaoCaoHangHoaBanHang,data: BaoCaoHangHoaBanHang[],totalItems: number}> {
    return this.http.get<{tong: BaoCaoHangHoaBanHang,data: BaoCaoHangHoaBanHang[],totalItems: number}>(`${this.apiUrl}`, {
      params: filter
    });
  }

  getLoiNhuan(filter: any): Observable<{tong: BaoCaoHangHoaBanHang,data: BaoCaoHangHoaBanHang[],totalItems: number}> {
    return this.http.get<{tong: BaoCaoHangHoaBanHang,data: BaoCaoHangHoaBanHang[],totalItems: number}>(`${this.apiUrl}`, {
      params: filter
    });
  }

  getGiaTriKho(params: any): Observable<{
  tong: BaoCaoHangHoaGiaTriKho,
  data: BaoCaoHangHoaGiaTriKho[],
  totalItems: number
}> {
  return this.http.get<{
    tong: BaoCaoHangHoaGiaTriKho,
    data: BaoCaoHangHoaGiaTriKho[],
    totalItems: number
  }>(`${this.apiUrl}`, {
    params: { ...params, moiQuanTam: 'gia-tri-kho', pageNumber: 1, pageSize: 10 } 
  });
}


  getXuatNhapTon(params: any): Observable<{
  tong: BaoCaoHangHoaXuatNhapTon,
  data: BaoCaoHangHoaXuatNhapTon[],
  totalItems: number
}> {
  return this.http.get<{
    tong: BaoCaoHangHoaXuatNhapTon,
    data: BaoCaoHangHoaXuatNhapTon[],
    totalItems: number
  }>(`${this.apiUrl}`, {
    params: { ...params, moiQuanTam: 'xuat-nhap-ton', kieuHienThi: 'report' }
  });
}
getXuatNhapTonChart(params: any): Observable<{
  TopTonCaoNhat: any[],
  TopTonThapNhat: any[]
}> {
  return this.http.get<{
    TopTonCaoNhat: any[],
    TopTonThapNhat: any[]
  }>(`${this.apiUrl}`, {
    params: { ...params, moiQuanTam: 'xuat-nhap-ton', kieuHienThi: 'chart' }
  });
}


  getXuatNhapTonChiTiet(params: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, {
      params: { ...params, moiQuanTam: 'xuat-nhap-ton-chi-tiet' }
    });
  }

  getNCCTheoHangNhap(params: any): Observable<{
  tong: BaoCaoHangHoaNhaCungCapNhap,
  data: BaoCaoHangHoaNhaCungCapNhap[],
  totalItems: number
}> {
  return this.http.get<{
    tong: BaoCaoHangHoaNhaCungCapNhap,
    data: BaoCaoHangHoaNhaCungCapNhap[],
    totalItems: number
  }>(`${this.apiUrl}`, {
    params: { ...params, moiQuanTam: 'ncc-theo-hang-nhap', kieuHienThi: 'report' }
  });
}

  getSuaChua(params: any): Observable<{ topDichVu: any[], topPhuTung: any[] }> {
  return this.http.get<{ topDichVu: any[], topPhuTung: any[] }>(`${this.apiUrl}`, {
    params: { ...params, moiQuanTam: 'sua-chua', kieuHienThi: 'chart' }
  });
}
exportExcel(filter: any) {
  let params = new HttpParams();
  Object.keys(filter).forEach(key => {
    if (filter[key] !== null && filter[key] !== undefined && filter[key] !== '') {
      params = params.set(key, filter[key]);
    }
  });

  return this.http.get('https://localhost:7037/api/bao-cao/hang-hoa/xuat-excel', {
    params,
    responseType: 'blob'
  });
}

getBaoCaoNhaCungCap(params: any): Observable<{
  tong: BaoCaoNhaCungCapDTO,
  data: BaoCaoNhaCungCapDTO[],
  totalItems: number,
  currentPage: number,
  pageSize: number
}> {
  let httpParams = new HttpParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      httpParams = httpParams.set(key, params[key]);
    }
  });

  return this.http.get<{
    tong: BaoCaoNhaCungCapDTO,
    data: BaoCaoNhaCungCapDTO[],
    totalItems: number,
    currentPage: number,
    pageSize: number
  }>(this.apiNCCUrl, { params: httpParams });
}

}
