import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table-product',
  imports: [CommonModule],
  templateUrl: './table-product.component.html',
  styleUrl: './table-product.component.css'
})
export class TableProductComponent {
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
