import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { ViewChild } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-sidebar-daily-report',
  imports: [FormsModule, CommonModule, MatDatepickerModule,MatInputModule,RouterModule],
  templateUrl: './sidebar-daily-report.component.html',
  styleUrl: './sidebar-daily-report.component.css'
})
export class SidebarDailyReportComponent {


  isVertical: boolean = false;
 
  interestOptions: string[] = ['Tổng Hóa Đơn', 'Hóa đơn bán hàng', 'Hóa đơn sửa chữa', 'Thu chi'];
  selectedInterest: string = 'Tổng Hóa Đơn';

  
  @Output() selectedInterestChange = new EventEmitter<string>();

  @ViewChild('picker') picker!: MatDatepicker<Date>;

  selectedTime = 'today';
  todayLabel = this.getTodayLabel();
  fromTime = '';
  toTime = '';

  onSelectedInterestChange() {
    this.selectedInterestChange.emit(this.selectedInterest);
  }
  
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
}
