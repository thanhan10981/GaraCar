import { CommonModule } from '@angular/common';

import {  FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { SoQuy } from '../model/model.component';
import { CashBookService } from '../service/cash-book.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-cash-book',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent,MatDatepickerModule],
  templateUrl: './cash-book.component.html',
  styleUrl: './cash-book.component.css'
})
export class CashBookComponent {
  tab: string = 'info';
  @ViewChild('picker') picker!: MatDatepicker<Date>;
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
  CashBooks: SoQuy[]= [];
  CashBook: SoQuy = this.GetCasBookEmty();
  constructor(  private cashBookService:CashBookService){}
  userRole= JSON.parse(localStorage.getItem('user') || '{}').ChucVu || '';
  userCode= JSON.parse(localStorage.getItem('user') || '{}').MaNhanVien || '';
  userName = JSON.parse(localStorage.getItem('user') || '{}').TenNhanVien || '';
  todayVN: string = '';
  Success = false;
  toastMessage = '';
  ngOnInit(): void {
this.filterSoQuy();
  this.todayVN = this.formatVietnamTime(new Date());
  const stored = localStorage.getItem('user');
  if (stored) {
      const user = JSON.parse(stored);
      this.userName = user.TenNhanVien ;
      this.userRole = user.ChucVu;
      this.userCode = user.MaNhanVien ;
  }
   this.layTongHopSoQuy();
   this.loadNhanViens();
}
danhSachNhanVien: any[] = [];
formatVietnamTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}



loadNhanViens() {
  this.cashBookService.getAllNhanViens().subscribe({
    next: res =>{ 
    this.danhSachNhanVien = res
   },
    error: err => console.error('Lỗi lấy danh sách nhân viên:', err)
  });
}


  GetCasBookEmty(){
    return{
      MaPhieu: '',         
      ThoiGian:  '',         
      GiaTri:  '',        
      NguoiNhan: '',       
      SoDienThoai: '', 
      DiaChi: '',         
      LoaiThuChi: '',     
      TrangThai: '',       
      NguoiTao: '',        
      NhanVien: '',      
      DoiTuongNhan: '',   
      GhiChu: '', 
      PhuongThucThanhToan:  '', 
    }
  }
  saveAddChi() {
   
 this.showForm = false;
  } 
  taoMaPhieuTuDong(): string {
  const prefix = this.CashBook.LoaiThuChi === 'Phiếu thu' ? 'PT' : 'PC';

  // Lấy số lượng hiện có từ danh sách (nếu bạn có mảng CashBooks)
  const soThuTu = (this.CashBooks?.filter(x => x.MaPhieu?.startsWith(prefix)).length || 0) + 1;

  // Format số thứ tự thành 2 chữ số, ví dụ: 01, 02...
  const maPhieu = prefix + soThuTu.toString().padStart(2, '0');

  return maPhieu;
}

  saveAddThuChi() {
    debugger
  const formData = new FormData();
  const maPhieu = this.taoMaPhieuTuDong();

  formData.append('MaPhieu', maPhieu);
  formData.append('ThoiGian', this.todayVN);
  formData.append('GiaTri', this.CashBook.GiaTri || '');
  formData.append('NguoiNhan', this.CashBook.NguoiNhan || '');
  formData.append('SoDienThoai', this.CashBook.SoDienThoai || '');
  formData.append('DiaChi', this.CashBook.DiaChi || '');
  formData.append('LoaiThuChi', this.CashBook.LoaiThuChi || '');
  formData.append('TrangThai', 'Đã thanh toán');
  formData.append('NguoiTao', this.userName || '');
  formData.append('NhanVien', this.CashBook.NhanVien || '');
  formData.append('DoiTuongNhan', this.CashBook.DoiTuongNhan || '');
  formData.append('GhiChu', this.CashBook.GhiChu || '');
  formData.append('PhuongThucThanhToan', this.CashBook.PhuongThucThanhToan || '');

  this.cashBookService.createCashBook(formData).subscribe({
    next: () => {
      this.toastMessage = 'Lưu thành công!';
      this.Success = true;
      this.showFormAdd = false;
      this.closeModalchi();
      setTimeout(() => this.Success = false, 3000);
      this.filterSoQuy();
      this.CashBook= this.GetCasBookEmty();
      this.layTongHopSoQuy();
    },
    error: err => {
      this.toastMessage = 'Lỗi lưu phiếu: ' + (err.error?.message || err.message);
      this.Success = true;
      this.showFormAdd = false;
      this.showForm = false;
      setTimeout(() => this.Success = false, 3000);
      this.CashBook= this.GetCasBookEmty();
    }
  });
    

  } 

 
  openModalAdd(){
    this.showFormAdd = true;
    this.CashBook.LoaiThuChi = 'Phiếu thu';
  }
  openModalchi(){
    this.showFormchi = true;
     this.CashBook.LoaiThuChi = 'Phiếu chi';
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
onDateSelected(event: any) {
  const date = new Date(event.value);
  const formatted = date.toISOString().split('T')[0];
  this.fromDate = formatted;
  this.toDate = formatted;
  this.filterSoQuy();
}

  selectOption(option: any) {
    this.selectedOption = option.value;
    this.selectedOptionLabel = option.label;
    this.showDropdown = false;
  }


selectedDay = '';
showDateRange = false;

onTimeChange() {
  const today = new Date();
  if (this.selectedTime === 'today') {
    const formatted = today.toISOString().split('T')[0];
    this.fromDate = formatted;
    this.toDate = formatted;
    this.showDateRange = false;
    this.filterSoQuy();
  }

  if (this.selectedDay === 'custom') {
    this.showDateRange = true;
  }
}

  
  isVertical: boolean = false;

  selectedTime = 'today';
  todayLabel = this.getTodayLabel();
  fromTime = '';
  toTime = '';

  openDatepicker() {
    this.picker.open();
  }

  // onDateSelected(event: any) {
  //   const date = event.value;
  //   if (date) {
  //     const day = String(date.getDate()).padStart(2, '0');
  //     const month = String(date.getMonth() + 1).padStart(2, '0');
  //     const year = date.getFullYear();
  //     this.todayLabel = `${day}/${month}/${year}`;
  //   }
  // }
  

  getTodayLabel(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  
  fromDate: string = '';
  toDate: string = '';



  generateReport() {
    console.log('Từ ngày:', this.fromDate);
    console.log('Đến ngày:', this.toDate);
    // Gọi API hoặc xử lý dữ liệu tổng hợp ở đây
  }
  selectedCashBook: any = null;
  selectedIndex: number = -1;
  
  selectCashBook(c: any, i: number) {
    // Nếu bấm vào lại đúng khách đang chọn thì ẩn đi
    if (this.selectedIndex === i) {
      this.selectedCashBook = null;
      this.selectedIndex = -1;
        this.showPrint = false;
    } else {
      this.selectedCashBook = c;
      this.selectedIndex = i;
       this.showPrint = true;
    }
  }
  showPrint = false;
  moPhieu(){
  this.showPhieu = true;
  }
  dongPhieu(){
    this.showPhieu = false;
  }
  @ViewChild('printArea') printArea!: ElementRef;

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
          <title>Gara-Sổ Quỹ</title>
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

numberToVietnameseText(number: number): string {
  const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const Tien = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  if (number === 0) return "Không đồng";

  let result = "";
  let i = 0;

  while (number > 0) {
    const block = number % 1000;
    if (block !== 0) {
      const blockText = docBlock(block);
      result = `${blockText} ${Tien[i]} ${result}`.trim();
    }
    number = Math.floor(number / 1000);
    i++;
  }

  result = result.charAt(0).toUpperCase() + result.slice(1) + " đồng chẵn";
  return result.replace(/\s+/g, ' ');

  function docBlock(num: number): string {
    const tram = Math.floor(num / 100);
    const chuc = Math.floor((num % 100) / 10);
    const donvi = num % 10;
    let str = "";

    if (tram > 0) {
      str += ChuSo[tram] + " trăm ";
      if (chuc === 0 && donvi > 0) str += "lẻ ";
    }

    if (chuc > 0) {
      if (chuc === 1) str += "mười ";
      else str += ChuSo[chuc] + " mươi ";
    }

    if (donvi > 0) {
      if (chuc !== 0 && donvi === 1) str += "mốt";
      else if (chuc !== 0 && donvi === 5) str += "lăm";
      else str += ChuSo[donvi];
    }

    return str.trim();
  }
}
capNhatNhanVienVaPhuongThuc() {
  const updateData = {
    MaPhieu: this.selectedCashBook.MaPhieu,
    NhanVien: this.selectedCashBook.NhanVien,
    PhuongThucThanhToan: this.selectedCashBook.PhuongThucThanhToan
  };

  this.cashBookService.capNhatNhanVienVaPhuongThuc(updateData).subscribe({
    next: () => {
      this.toastMessage = 'Cập nhật thành công!';
      this.Success = true;
       this.showPhieu = false;
      setTimeout(() => this.Success = false, 3000);
    },
    error: err => {
      this.toastMessage = 'Lỗi cập nhật: ' + (err.error?.message || err.message || err.statusText);
      this.Success = true;
      setTimeout(() => this.Success = false, 3000);
    }
  });
}
quyDauKy = 0;
tongThu = 0;
tongChi = 0;
tonQuy = 0;

layTongHopSoQuy() {
  this.cashBookService.getSoQuyTongHop().subscribe({
    next: res => {
      this.quyDauKy = res.quyDauKy;
      this.tongThu = res.tongThu;
      this.tongChi = res.tongChi;
      this.tonQuy = res.tonQuy;
    },
    error: err => console.error('Lỗi tổng hợp sổ quỹ:', err)
  });
}

isExporting: boolean = false;

exportSoQuyToExcel() {
   this.isExporting = true;
  this.cashBookService.exportToExcelSoQuy().subscribe({
    next: (blob) => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `SoQuy_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.toastMessage = 'Xuất file thành công!';
      this.Success = true;
       this.isExporting = false;
      setTimeout(() => this.Success = false, 3000);
    },
    error: err => {
      this.toastMessage = 'Xuất file thất bại!';
      this.Success = true;
       this.isExporting = false;
      setTimeout(() => this.Success = false, 3000);
    }
  });
}
allSelected: boolean = false;
selectedRows: any[] = [];
toggleAllSelection() {
  if (this.allSelected) {
    this.selectedRows = [...this.CashBooks];
  } else {
    this.selectedRows = [];
  }
}

toggleSelection(event: MouseEvent, item: any) {
  event.stopPropagation(); // Ngăn selectCashBook bị gọi

  const index = this.selectedRows.findIndex(row => row.MaPhieu === item.MaPhieu);
  if (index > -1) {
    this.selectedRows.splice(index, 1);
  } else {
    this.selectedRows.push(item);
  }

  // Cập nhật trạng thái allSelected
  this.allSelected = this.selectedRows.length === this.CashBooks.length;
}

isSelected(item: any): boolean {
  return this.selectedRows.some(row => row.MaPhieu === item.MaPhieu);
}
xoaNhieuPhieu() {
  const maPhieus = this.selectedRows.map(row => row.MaPhieu);

  this.cashBookService.deleteNhieuPhieu(maPhieus).subscribe({
    next: () => {
      this.toastMessage = 'Đã xóa các dòng được chọn!';
      this.Success = true;
      this.filterSoQuy();
      this.selectedRows = [];
      this.allSelected = false;
      setTimeout(() => this.Success = false, 3000);
    },
    error: err => {
      this.toastMessage = 'Lỗi khi xóa: ' + (err.error?.message || err.message);
      this.Success = true;
      setTimeout(() => this.Success = false, 3000);
    }
  });
}

  // Phân trang
  page = 1;
  pageSize = 10;
  totalItems = 0;
  pages: number[] = [];

  // Bộ lọc
  selectedLoaiQuy: string = 'tongQuy';
  selectedLoaiThuChi: string = '';
  selectedNhanVien: string = '';
  selectedLoaiChungTu1: string = 'phieuThu';    
  selectedLoaiChungTu2: string = '';     
  selectedTrangThai1: string = 'daThanhToan'; 
  selectedTrangThai2: string = ''; 

  // Thời gian

  changePage(newPage: number) {
    this.page = newPage;
    this.filterSoQuy();
  }



filterSoQuy() {
  let params = new HttpParams()
    .set('pageNumber', this.page.toString())
    .set('pageSize', this.pageSize.toString());
// Xử lý lọc trạng thái
let trangThaiArr = [];
if (this.selectedTrangThai1) trangThaiArr.push(this.selectedTrangThai1);
if (this.selectedTrangThai2) trangThaiArr.push(this.selectedTrangThai2);

// Nếu chọn đúng 1 thì truyền, nếu 2 hoặc 0 thì không truyền
if (trangThaiArr.length === 1) {
  params = params.set('trangThai', trangThaiArr[0]);
}

// Xử lý lọc loại chứng từ
let loaiCTArr = [];
if (this.selectedLoaiChungTu1) loaiCTArr.push(this.selectedLoaiChungTu1);
if (this.selectedLoaiChungTu2) loaiCTArr.push(this.selectedLoaiChungTu2);

if (loaiCTArr.length === 1) {
  params = params.set('loaiChungTu', loaiCTArr[0]);
}

  if (this.selectedLoaiQuy) {
    params = params.set('loaiQuy', this.selectedLoaiQuy);
  }
  if (this.selectedNhanVien) {
    params = params.set('nhanVien', this.selectedNhanVien);
  }
  if (this.searchKeyword) {
    params = params.set('keyword', this.searchKeyword);
  }
  if (this.fromDate) {
  params = params.set('tuNgay', this.fromDate);
  }
  if (this.toDate) {
    params = params.set('denNgay', this.toDate);
  }


  // Gọi API lọc
  this.cashBookService.getFilteredSoQuy(params).subscribe(res => {
    this.CashBooks = res.body || [];
    this.totalItems = +(res.headers.get('X-Total-Count') || '0');
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  });
}


  onSearch() {
    this.page = 1;
    this.filterSoQuy();
  }
  
}
