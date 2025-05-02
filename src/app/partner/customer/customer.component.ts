import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  searchOptions = [
    { value: 'code', label: 'Theo mã, tên, điện thoại' },
    { value: 'email', label: 'Theo email' },
    { value: 'address', label: 'Theo địa chỉ' },
    { value: 'note', label: 'Theo ghi chú' },
    { value: 'invoice', label: 'Theo mã hóa đơn' }
  ];
  
  selectedOption = 'code';
  selectedOptionLabel = 'Theo mã, tên, điện thoại';
  searchKeyword = '';
  showDropdown = false;
  
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  
  selectOption(option: any) {
    this.selectedOption = option.value;
    this.selectedOptionLabel = option.label;
    this.showDropdown = false;
  }
  
  onSearch() {
    console.log(`Tìm với: ${this.searchKeyword} - theo ${this.selectedOption}`);
  }
  
  
  customers = [
    { code: 'KH000005', name: 'Chị Lý - Kim Mã', type: 'Cá nhân', phone: '', address: '', region: '', note: '' },
    { code: 'KH000004', name: 'Mr Hoàng - Sài Gòn', type: 'Cá nhân', phone: '', address: '', region: '', note: '' },
    { code: 'KH000003', name: 'Trần Cao Vân', type: 'Cá nhân', phone: '', address: '', region: '', note: '' },
    { code: 'KH000002', name: 'Phạm Văn Bạch', type: 'Cá nhân', phone: '', address: '', region: '', note: '' },
    { code: 'KH000001', name: 'Nguyễn Tuấn Minh', type: 'Cá nhân', phone: '', address: '', region: '', note: '' }
  ];}
