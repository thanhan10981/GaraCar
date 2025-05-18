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
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import html2canvas from 'html2canvas';

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

  constructor(private displayService: DisplayService) {}
  ngayLapBaoCao: string = '';
  nam: string = '';

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

  async downloadExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo cáo bán hàng');

    // Tiêu đề
    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').value = 'BÁO CÁO CUỐI NGÀY VỀ BÁN HÀNG';
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { size: 16, bold: true };

    worksheet.addRow([
      'Ngày bán: 28/04/2025',
      '',
      '',
      '',
      '',
      'Ngày thanh toán: 28/04/2025',
    ]);
    worksheet.addRow([]); // Dòng trống

    // Header
    const headerRow = worksheet.addRow([
      'Thời gian',
      'SL đơn bán',
      'Tổng tiền hàng',
      'Giảm giá HĐ',
      'Doanh thu',
      'Giá trị trả',
      'Doanh thu thuần',
    ]);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'B2F1F0' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data
    worksheet.addRow([
      '29/04/2025',
      1,
      '3.897.000',
      0,
      '3.897.000',
      0,
      '3.897.000',
    ]);

    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    FileSaver.saveAs(new Blob([buffer]), 'bao-cao-ban-hang.xlsx');
  }

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

  toggleFullscreen(element: HTMLElement) {
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.error(`Không thể bật toàn màn hình: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
}
