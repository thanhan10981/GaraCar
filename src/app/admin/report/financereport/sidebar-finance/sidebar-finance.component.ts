import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-finance.component.html',
  styleUrl: './sidebar-finance.component.css'
})
export class SidebarFinanceComponent {
  @Output() filterChanged = new EventEmitter<{ fromDate?: string, toDate?: string, thoiGian?: string }>();


  selectedTime: string = 'week';
  selectedLabel: string = 'Tuần này';
  showQuickSelect: boolean = false;
  showDateRange: boolean = false;
  fromDate: string = '';
  toDate: string = '';

  

  ngOnInit() {
  
    // Gửi mặc định ngay khi vào trang
    this.emitQuickRange(this.selectedLabel);
  }

  toggleQuickSelect(event: MouseEvent) {
    event.stopPropagation(); // Không lan sự kiện ra ngoài
    this.showQuickSelect = !this.showQuickSelect;
  }

  onTimeChange() {
    this.showDateRange = this.selectedTime === 'custom';

    // Khi chuyển từ radio khác về "Tuần này" (week), gửi lại selectedLabel
    if (this.selectedTime === 'week') {
      this.emitQuickRange(this.selectedLabel);
    }
    if (this.selectedTime !== 'week') {
      this.showQuickSelect = false;
    }
  }

  // Khi chọn mốc nhanh
  selectQuickRange(type: string) {
    this.selectedLabel = type;
    this.showQuickSelect = false;
    this.emitQuickRange(type);
  }

  // Phát sự kiện chọn nhanh
  private emitQuickRange(type: string) {
    this.filterChanged.emit({
      thoiGian: type
    });
  }

  // Khi nhấn nút tạo báo cáo với ngày từ -> đến
 generateReport() {
  if (!this.fromDate || !this.toDate) return;
  this.filterChanged.emit({
    fromDate: this.fromDate,
    toDate: this.toDate
  });
}


  
}
