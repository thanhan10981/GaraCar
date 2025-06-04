import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisplayService } from '../../display.service';

@Component({
  selector: 'app-sidebar-sell',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-sell.component.html',
  styleUrl: './sidebar-sell.component.css',
})
export class SidebarSellComponent {
  [x: string]: any;

  // Các biến lưu trạng thái lựa chọn trên sidebar
  isVertical: boolean = false;
  selectedInterest: string = 'Doanh thu';
  interestOptions: string[] = [
    'Doanh thu',
    'Lợi nhuận',
    'Nhân viên',
  ];

  selectedTime: string = 'week'; // Kiểu lọc thời gian đang chọn
  selectedLabel: string = 'Tuần này'; // Nhãn hiển thị ở label
  showQuickSelect: boolean = false; // Có hiển thị popup chọn nhanh không
  selectedPhuongThucThanhToan: string = '';
  selectedDay: string = '';
  showDateRange: boolean = false; // Bật/tắt vùng nhập ngày từ - đến khi chọn "custom"
  selectedKieuBanHang: string ='';
  fromDate: string = ''; // Ngày bắt đầu khi lọc khoảng thời gian
  toDate: string = ''; // Ngày kết thúc khi lọc khoảng thời gian
  sortBy: string = '';      // "doanhThu", "giaVon", "loiNhuan"
  sortOrder: string = 'desc'; 
  kieuHienThi: string = 'chart'; // Dùng để điều khiển hiển thị kiểu chart/report

  constructor(private displayService: DisplayService) {}

  // Gọi khi khởi tạo component: Cập nhật kiểu hiển thị vào shared service

  ngOnInit() {
    this.displayService.updateDisplayType(this.kieuHienThi);
    this.generateReport(); 
  }

  // Gọi khi người dùng đổi kiểu hiển thị giữa biểu đồ <-> báo cáo

  onChange() {
    this.displayService.updateDisplayType(this.kieuHienThi);
  }

  // Mở/tắt menu chọn nhanh khi click vào nút tam giác

  toggleQuickSelect(event: MouseEvent) {
    event.stopPropagation(); // Ngăn chặn click lan ra ngoài
    this.showQuickSelect = !this.showQuickSelect;
  }

  // Gán nhãn lựa chọn khi người dùng chọn mốc thời gian nhanh như "Tuần này", "Hôm nay"...

  selectQuickRange(type: string) {
    this.selectedLabel = type;
    this.generateReport();
  }

  //  Gọi khi người dùng chọn radio "Lựa chọn khác" để hiện form chọn ngày từ - đến

  onTimeChange() {
    this.showDateRange = this.selectedTime === 'custom';
    if (this.selectedTime !== 'week') {
      this.showQuickSelect = false;
    }
  }

  // EMIT filter ra ngoài cho component cha (PageSellreportComponent) xử lý

  @Output() filterChanged = new EventEmitter<any>();

  // Gọi khi người dùng nhấn nút "Tạo báo cáo" – gửi các điều kiện lọc ra ngoài component cha

  generateReport() {
  let thoiGian = this.selectedLabel;
  if (this.selectedTime === 'custom') {
    thoiGian = 'Lựa chọn khác';
  }
    const filter = {
    thoiGian: thoiGian,  
    tuNgay: this.fromDate ? new Date(this.fromDate).toISOString().substring(0, 10) : '',
    denNgay: this.toDate ? new Date(this.toDate).toISOString().substring(0, 10) : '',
    kieuBanHang: this.selectedKieuBanHang,
    loaiBaoCao: this.selectedInterest,
    sortBy: this.sortBy,
    sortOrder: this.sortOrder
    };

    //  Phát sự kiện ra ngoài cho cha (PageSellreportComponent)
    this.filterChanged.emit(filter);
  }
  
}
