import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { SidebarSellComponent } from '../sidebar-sell/sidebar-sell.component';
import { ChartSellComponent } from '../chart-sell/chart-sell.component';
import { RouterModule } from '@angular/router';
import { DisplayService } from '../../display.service';
import { TableSellComponent } from '../table-sell/table-sell.component';

@Component({
  selector: 'app-page-sellreport',
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatInputModule, SidebarSellComponent, RouterModule, ChartSellComponent, TableSellComponent],
  templateUrl: './page-sellreport.component.html',
  styleUrl: './page-sellreport.component.css'
})
export class PageSellreportComponent {
  kieuHienThi: string = 'chart';
  zoomLevel: number = 1;
  rotate: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private displayService: DisplayService) { }

  ngOnInit() {
    this.displayService.currentDisplayType.subscribe(value => {
      this.kieuHienThi = value;
    });
  }
  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > 0.3) this.zoomLevel -= 0.1;
  }

  resetZoom() {
    this.zoomLevel = 1;
  }

  rotateLeft() {
    this.rotate -= 90;
  }

  rotateRight() {
    this.rotate += 90;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToFirstPage() {
    this.currentPage = 1;
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
  }

  goToPage(event: any) {
    const page = parseInt(event.target.value, 10);
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  downloadPDF() {
    window.print(); // hoặc dùng html2pdf nếu cần xuất file thật
  }

  printPage() {
    window.print();
  }

  openSettings() {
    alert('Chức năng cài đặt đang phát triển...');
  }

}
