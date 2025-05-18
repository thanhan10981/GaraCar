import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-sell',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './table-sell.component.html',
  styleUrls: ['./table-sell.component.css']
})
export class TableSellComponent {
  showDetail = false;
  hasData = true; // kiểm tra dữ liệu có tồn tại

  chiTiet = [
    {
      ma: 'HD00049',
      thoiGian: '29/04/2025 21:17',
      nhanVien: 'vinh',
      khachHang: 'Khách lẻ',
      tongTien: 1299000,
      giamGia: 0,
      doanhThu: 1299000
    }
  ];

  toggleDetail(state: boolean) {
    this.showDetail = state;
  }
}
