import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  products = [
    {
      code: 'TBDCN009',
      name: 'Máy phát điện Rato R7000d B1 5.5kva-kg',
      salePrice: 16000000,
      costPrice: 14500000,
      stock: 0,
      order: 0,
      createdAt: '19/04/2025 13:16'
    },
    {
      code: 'TBDCN008',
      name: 'Ổ cắm Bals',
      salePrice: 455000,
      costPrice: 312000,
      stock: 9,
      order: 0,
      createdAt: '19/04/2025 13:16'
    }
    // Thêm các sản phẩm khác ở đây
  ];
}
