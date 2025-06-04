import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NhanVien, SoQuy } from '../model/model.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashBookService {

  private apiUrl = 'https://localhost:7037/api/SoQuys';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SoQuy[]> {
    return this.http.get<SoQuy[]>(this.apiUrl);
  }
  getAllNhanViens(): Observable<NhanVien[]> {
      return this.http.get<NhanVien[]>('https://localhost:7037/api/NhanViens');
    }
 capNhatNhanVienVaPhuongThuc(data: { MaPhieu: string; NhanVien: string; PhuongThucThanhToan: string }) {
  const formData = new FormData();
  formData.append('NhanVien', data.NhanVien);
  formData.append('PhuongThucThanhToan', data.PhuongThucThanhToan);

  return this.http.put(`https://localhost:7037/api/SoQuys/${data.MaPhieu}/cap-nhat-nv-pt`, formData);
}
getSoQuyTongHop() {
  return this.http.get<{
    quyDauKy: number;
    tongThu: number;
    tongChi: number;
    tonQuy: number;
  }>('https://localhost:7037/api/SoQuys/tong-hop');
}
createCashBook(formData: FormData) {
  return this.http.post(this.apiUrl, formData);
}
exportToExcelSoQuy() {
  return this.http.get('https://localhost:7037/api/SoQuys/export', {
    responseType: 'blob' // để nhận file từ backend
  });
}
deleteNhieuPhieu(maPhieus: string[]) {
  return this.http.delete(`https://localhost:7037/api/SoQuys/xoa-nhieu`, {
    body: maPhieus,
  });
}

getFilteredSoQuy(params: any) {
  return this.http.get<any[]>('https://localhost:7037/api/SoQuys/phan-trang-loc', {
    params,
    observe: 'response'
  });
}




}
