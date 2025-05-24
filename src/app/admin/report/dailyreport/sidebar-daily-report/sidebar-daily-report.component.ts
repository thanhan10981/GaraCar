import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { NhanVienService } from '../../../service/nhanvien.service';
import { NhanVien } from '../../../model/model.component';

@Component({
  selector: 'app-sidebar-daily-report',
  imports: [FormsModule, CommonModule, MatDatepickerModule, MatInputModule, RouterModule],
  templateUrl: './sidebar-daily-report.component.html',
  styleUrl: './sidebar-daily-report.component.css'
})
export class SidebarDailyReportComponent {
  isVertical: boolean = false;
  interestOptions: string[] = ['Tổng Hóa Đơn', 'Hóa đơn bán hàng', 'Hóa đơn sửa chữa', 'Thu chi'];
  selectedInterest: string = 'Tổng Hóa Đơn';

  @Output() selectedInterestChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<string>();
  @Output() timeFilterChange = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<void>();
  @ViewChild('picker') picker!: MatDatepicker<Date>;
  @Output() nhanVienChanged = new EventEmitter<string>();
  @Output() nguoiTaoChanged = new EventEmitter<string>();
  @Output() phuongThucChanged = new EventEmitter<string>();
  phuongThucThanhToan = '';
  selectedTime: 'today' | 'custom' = 'today';
  todayLabel = this.getTodayLabel();
  fromTime = '';
  toTime = '';
  fromDate: string = '';
  toDate: string = '';
  showDateRange = false;
  selectedDay: string = '';
  nhanVienFilter = '';
  nguoiTao: string = '';


  ngOnInit() {
  // Mặc định emit filter khi khởi tạo
  setTimeout(() => {
    this.emitTimeFilter();
  });
  this.loadNhanVien();
    setTimeout(() => this.emitTimeFilter());
}

  onNhanVienChange(): void {
    this.nhanVienChanged.emit(this.nhanVienFilter);
    this.filterChange.emit();
  }
  onSelectedInterestChange() {
    this.selectedInterestChange.emit(this.selectedInterest);
  }

  openDatepicker() {
    this.picker.open();
  }
  onNguoiTaoChange(): void {
  const selectedTenNV = this.danhSachQuanLy.find(nv => nv.MaNhanVien === this.nguoiTao)?.TenNhanVien || '';
  this.nguoiTaoChanged.emit(selectedTenNV); // Emit tên thay vì mã
}
onPhuongThucChange() {
  this.phuongThucChanged.emit(this.phuongThucThanhToan);
}

  // ✅ Sửa: Khi chọn ngày thì cũng emit lọc
 onDateSelected(event: any) {
  const d: Date = event.value;
  if (!d) return;
  this.todayLabel = this.formatDate(d);  
  this.selectedTime = 'today';
  this.dateChange.emit(this.todayLabel); 
  this.emitTimeFilter();
}


  onTimeChange() {
    if (this.selectedTime === 'today') {
      this.todayLabel = this.getTodayLabel();
      this.dateChange.emit(this.todayLabel);
      this.emitTimeFilter();
      this.showDateRange = false;
    } else {
      this.showDateRange = true;
    }
  }
  onTimeInputChanged() {
  this.emitTimeFilter();        // gửi ngay filter mới
  this.filterChange.emit();     // (tuỳ bạn có cần hay không)
}

  onGenerateRange() {
    if (this.fromDate && this.toDate) {
      const fromD = new Date(this.fromDate);
      const toD = new Date(this.toDate);

      const f = this.formatDate(fromD, '/');
      const t = this.formatDate(toD, '/');

      this.dateChange.emit(`${f} - ${t}`);
      this.emitTimeFilter();

      // ✅ Thêm: vẫn giữ selectedTime là 'custom' nếu chọn lại lần nữa
      this.selectedTime = 'custom';
      this.showDateRange = true;
    }
  }

  private emitTimeFilter() {
  const from = this.fromTime || '00:00';
  const to   = this.toTime   || '23:59';

  this.timeFilterChange.emit({
    type     : this.selectedTime,
    date     : this.selectedTime === 'today' ? new Date(new Date().toDateString()) : new Date(this.fromDate),
endDate  : this.selectedTime === 'today' ? new Date(new Date().toDateString()) : new Date(this.toDate),
    fromTime : from,
    toTime   : to
  });
}


  formatDate(d: Date, sep: string = '/'): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    return `${dd}${sep}${mm}${sep}${yy}`;
  }

  getTodayLabel(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // lọc khách hàng
   khachHangFilter: string = '';
  @Output() khachHangKeywordChanged = new EventEmitter<string>();
  onKhachHangChange(): void {
    const keyword = this.khachHangFilter.trim();
    this.khachHangKeywordChanged.emit(keyword); // gửi keyword lên cha
  }
  // load nhân viên
   danhSachNhanVien: NhanVien[] = [];
  danhSachQuanLy: NhanVien[] = [];
   constructor(private nhanVienService: NhanVienService) {}
loadNhanVien() {
    this.nhanVienService.getAllNhanViens().subscribe((ds) => {
      this.danhSachNhanVien = ds;
      this.danhSachQuanLy = ds.filter(nv => nv.ChucVu.toLowerCase() === 'quản lý');
    });
  }

}
