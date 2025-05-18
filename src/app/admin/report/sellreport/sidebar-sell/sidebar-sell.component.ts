import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DisplayService } from '../../display.service';


@Component({
  selector: 'app-sidebar-sell',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-sell.component.html',
  styleUrl: './sidebar-sell.component.css'
})
export class SidebarSellComponent {
  [x: string]: any;
  isVertical: boolean = false;
  selectedInterest: string = 'Thời gian';
  interestOptions: string[] = ['Thời gian', 'Lợi nhuận', 'Giảm giá HĐ', 'Nhân viên'];

  selectedTime: string = 'week';
  selectedLabel: string = 'Tuần này';
  showQuickSelect: boolean = false;

  toggleQuickSelect(event: MouseEvent) {
    event.stopPropagation(); // Ngăn chặn việc click ảnh hưởng tới radio
    this.showQuickSelect = !this.showQuickSelect;
  }
  
  selectQuickRange(type: string) {
    this.selectedLabel = type;
  }
  selectedDay: string = '';
  showDateRange: boolean = false;
  
  fromDate: string = '';
  toDate: string = '';

  onTimeChange() {
   this.showDateRange = this.selectedTime === 'custom';
  if (this.selectedTime !== 'week') {
    this.showQuickSelect = false;
  }
  }

  generateReport() {
    console.log('Từ ngày:', this.fromDate);
    console.log('Đến ngày:', this.toDate);
    // Gọi API hoặc xử lý dữ liệu tổng hợp ở đây
  }
  kieuHienThi:string='chart';
  constructor(private displayService: DisplayService){}
  ngOnInit(){
    this.displayService.updateDisplayType(this.kieuHienThi);
  }
  onChange(){
    this.displayService.updateDisplayType(this.kieuHienThi);
  }
}
