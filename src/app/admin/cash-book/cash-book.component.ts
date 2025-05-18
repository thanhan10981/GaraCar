import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-cash-book',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent,MatDatepickerModule],
  templateUrl: './cash-book.component.html',
  styleUrl: './cash-book.component.css'
})
export class CashBookComponent {
  tab: string = 'info';

  @ViewChild('picker') picker!: MatDatepicker<Date>;
  searchOptions = [
    { value: 'code', label: 'Theo mã, tên, điện thoại' },
    { value: 'email', label: 'Theo email' },
    { value: 'address', label: 'Theo địa chỉ' },
    { value: 'note', label: 'Theo ghi chú' },
    { value: 'invoice', label: 'Theo mã hóa đơn' }
  ];
  showFormGroupKhachHang = false;  // thay vì showForm
activeTabGroupKH = 'info';

  selectedOption = 'code';
  selectedOptionLabel = 'Theo mã, tên, điện thoại';
  searchKeyword = '';
  showDropdown = false;
  showForm = false;
  showFormAdd = false;
  showFormchi = false;
  showPhieu = false;

  customerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      maKhachHang: ['KH000005'],
      tenKhachHang: ['Chị Lý - Kim Mã'],
      dienThoai: [''],
      ngaySinh: [''],
      gioiTinh: [''],
      diaChi: [''],
      loaiKhach: ['Cá nhân'],
      maSoThue: [''],
      cmnd: [''],
      email: [''],
      facebook: [''],
      ghiChu: ['']
    });
  }

  save() {
    console.log(this.customerForm.value);
    // TODO: Gửi dữ liệu lên server
    this.showForm = false;
    this.showFormAdd = false;
  }
  openModalAdd(){
    this.showFormAdd = true;
  }
  openModalchi(){
    this.showFormchi = true;
  }
  closeModalchi() {
    this.showFormchi = false;
  }
  closeModalAdd() {
    this.showFormAdd = false;
  }
  openModal(){
    this.showForm = true;
  }
  closeModal() {
    this.showForm = false;
  }
  customerImageUrl: string | ArrayBuffer | null = null;

selectImage() {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  fileInput?.click();
}

onImageSelected(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.customerImageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

  
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
  ];
  isVertical: boolean = false;
  selectedInterest: string = 'Bán hàng';
  

  interestOptions: string[] = ['Bán hàng', 'Thu chi', 'Hàng hóa', 'Tổng hợp'];



  selectedTime = 'today';
  todayLabel = this.getTodayLabel();
  fromTime = '';
  toTime = '';

  openDatepicker() {
    this.picker.open();
  }

  onDateSelected(event: any) {
    const date = event.value;
    if (date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      this.todayLabel = `${day}/${month}/${year}`;
    }
  }
  

  getTodayLabel(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }
  selectedDay: string = '';
  showDateRange: boolean = false;
  
  fromDate: string = '';
  toDate: string = '';

  onTimeChange() {
    if (this.selectedDay === 'custom') {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
    }
  }

  generateReport() {
    console.log('Từ ngày:', this.fromDate);
    console.log('Đến ngày:', this.toDate);
    // Gọi API hoặc xử lý dữ liệu tổng hợp ở đây
  }
  selectedCustomer: any = null;
  selectedIndex: number = -1;
  
  selectCustomer(c: any, i: number) {
    // Nếu bấm vào lại đúng khách đang chọn thì ẩn đi
    if (this.selectedIndex === i) {
      this.selectedCustomer = null;
      this.selectedIndex = -1;
    } else {
      this.selectedCustomer = c;
      this.selectedIndex = i;
    }
  }
  moPhieu(){
    this.showPhieu = true;
  }
  dongPhieu(){
    this.showPhieu = false;
  }
  print(): void {
    const printContents = document.getElementById('printArea')?.innerHTML;
    if (!printContents) {
      console.error("Không tìm thấy nội dung để in");
      return;
    }
  
    const popupWin = window.open('', '_blank', 'width=800,height=1000');
    if (!popupWin) {
      console.error("Không thể mở cửa sổ in (có thể bị trình duyệt chặn)");
      return;
    }
  
    popupWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>In phiếu chi</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .title { text-align: center; font-size: 20px; font-weight: bold; }
            .signatures { display: flex; justify-content: space-around; margin-top: 60px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContents}
        </body>
      </html>
    `);
    popupWin.document.close();
  }
  
}
