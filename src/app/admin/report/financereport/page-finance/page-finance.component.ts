import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { TableFinanceComponent } from '../table-finance/table-finance.component';
import { SidebarFinanceComponent } from '../sidebar-finance/sidebar-finance.component';
import { RouterModule } from '@angular/router';
import { DisplayService } from '../../display.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BaocaotaichinhService } from '../../../service/baocaotaichinh.service';

@Component({
  selector: 'app-page-finance',
  imports: [
      CommonModule,
      FormsModule,
      MatDatepickerModule,
      MatInputModule,
      RouterModule,
      TableFinanceComponent,
      SidebarFinanceComponent,
    ],
  templateUrl: './page-finance.component.html',
  styleUrl: './page-finance.component.css'
})
export class PageFinanceComponent {
  kieuHienThi: string = 'report';
  zoomLevel: number = 1;
  rotate: number = 0;
  currentPage: number = 1;
  totalPages: number = 10;
  constructor(private displayService: DisplayService, private baocaotaichinhService : BaocaotaichinhService) {}
  ngayLapBaoCao: string = '';
  nam: string = '';
  fromDate: string = '';
  toDate: string = '';
  thoiGian: string = ''; 


  ngOnInit(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.ngayLapBaoCao = `${day}/${month}/${year} ${hours}:${minutes}`;
    this.nam = `${year}`;
  }

  reload() {
    this.kieuHienThi = '';
    setTimeout(() => {
      this.kieuHienThi = 'report';
    });
  }

  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > 0.3) this.zoomLevel -= 0.1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePageView();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageView();
    }
  }

  updatePageView() {
    // Hàm này để cập nhật lại nội dung trang hiện tại
    // Có thể gọi API hoặc thay đổi view tùy theo cách bạn xử lý trang
    console.log(`Đang ở trang ${this.currentPage}`);
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

  showExportMenu = false;

  toggleExportMenu(event: MouseEvent) {
    event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
    this.showExportMenu = !this.showExportMenu;
  }

  downloadPDF() {
    const content = document.querySelector('.content') as HTMLElement;
    if (!content) return;

    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('bao-cao-ban-hang.pdf');
      this.showExportMenu = false;
    });
  }
  @ViewChild('tableReport', { static: false }) tableReport!: ElementRef;

  // Đóng menu khi click ngoài vùng export
  @HostListener('document:click')
  onDocumentClick() {
    this.showExportMenu = false;
  }

  printPage() {
    const content = document.querySelector('.content') as HTMLElement;
    if (!content) return;

    html2canvas(content, { scale: 2 }).then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png');

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Báo cáo bán hàng</title>
            <style>
              body, html {
                margin: 0;
                padding: 0;
                text-align: center;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" />
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
    });
  }
downloadExcel() {
    this.baocaotaichinhService.exportBaoCaoTaiChinh(this.currentFilter).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `BaoCaoTaiChinh_${new Date().toISOString()}.xlsx`;
      link.click();
    }, error => {
      console.error('Lỗi khi xuất Excel:', error);
    });
  }
  toggleFullscreen(element: HTMLElement) {
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.error(`Không thể bật toàn màn hình: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
  onFilterChanged(event: { fromDate?: string, toDate?: string, thoiGian?: string }) {
  this.fromDate = event.fromDate || '';
  this.toDate = event.toDate || '';
  this.thoiGian = event.thoiGian || '';
  this.reload();
   this.currentFilter = {
    ...this.currentFilter, // giữ lại các giá trị khác
    tuNgay: this.fromDate,
    denNgay: this.toDate,
    thoiGian: this.thoiGian,
    pageNumber: 1 // reset về trang đầu nếu cần
  };
}
currentFilter: {
    thoiGian:    string;
    tuNgay:      string;
    denNgay:     string;
    maLoaiHang:  string;
    maNhaCungCap:string;
    sortBy:      string;
    sortOrder:   string;
    pageNumber?: number;
    pageSize?:   number;
  } = {
    thoiGian:    'Tháng này',
    tuNgay:      '',
    denNgay:     '',
    maLoaiHang:  '',
    maNhaCungCap:'',
    sortBy:      '',
    sortOrder:   '',
    pageNumber:  1,    // khởi tạo mặc định
    pageSize:    10    // khởi tạo mặc định
  };
}
