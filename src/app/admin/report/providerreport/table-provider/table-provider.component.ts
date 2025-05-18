import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-provider',
  imports: [CommonModule],
  templateUrl: './table-provider.component.html',
  styleUrl: './table-provider.component.css'
})
export class TableProviderComponent {
  showDetail = false;
  hasData = true; // kiểm tra dữ liệu có tồn tại

  chiTiet = [
    {
      ma: 'HD00049',
      thoiGian: '29/04/2025 21:17',
      Soluong:10,
      tongTien: 1299000,
    }
  ];

  toggleDetail(state: boolean) {
    this.showDetail = state;
  }

}
