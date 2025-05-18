import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-finance',
  imports: [CommonModule],
  templateUrl: './table-finance.component.html',
  styleUrl: './table-finance.component.css'
})
export class TableFinanceComponent {
data = {
  doanhThu: 408340000,
  giamTru: 0,
  ckHoaDon: 0,
  hangTraLai: 0,
  doanhThuThuan: 408340000,
  giaVon: 337720000,
  loiNhuanGop: 70620000,
  chiPhi: 0,
  cpVoucher: 0,
  cpDtgh: 0,
  cpHuy: 0,
  cpDiem: 0,
  ckKhach: 0,
  luongNv: 0,
  loiNhuanHd: 70620000,
  thuNhapKhac: 0,
  phiTraHang: 0,
  ckNcc: 0,
  cpKhac: 0,
  loiNhuanThuan: 70620000
};

}
