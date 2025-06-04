import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { SidebarSellComponent } from '../sidebar-sell/sidebar-sell.component';
import { ChartSellComponent } from '../chart-sell/chart-sell.component';
import { RouterModule } from '@angular/router';
import { DisplayService } from '../../display.service';
import { TableSellComponent } from '../table-sell/table-sell.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DoanhThuLoiNhan, DoanhThuLoiNhuanResponse } from '../../../model/model.component';
import { HoaDonService } from '../../../service/hoadon.service';
// tải npm install html2canvas
// tải thư viện jsPDF
// tải thư viện XLSX
// tải npm install exceljs file-saver ( kiểm soát màu mè của thằng xlsx)
@Component({
  selector: 'app-page-sellreport',
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    SidebarSellComponent,
    RouterModule,
    ChartSellComponent,
    TableSellComponent,
  ],
  templateUrl: './page-sellreport.component.html',
  styleUrl: './page-sellreport.component.css',
})
export class PageSellreportComponent {
  kieuHienThi: string = 'chart';
  zoomLevel: number = 1;
  rotate: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageRange: number[] = [];
  pageSize = 12;
  pagedData: DoanhThuLoiNhan[][] = [];
  allFilteredDoanhThu: DoanhThuLoiNhan[] = [];
  tongSoLuongDon = 0;
  tongGiaVon = 0;
  tongDoanhThu = 0;
  tongPhuThu = 0;
  tongLoiNhuan = 0;
  constructor(private displayService: DisplayService,  private hoadonService: HoaDonService) {}
  ngayLapBaoCao: string = '';
  nam: string = '';
  @Input() loaiBaoCao: string = '';
  ngOnInit(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.displayService.currentDisplayType.subscribe((value) => {
      this.kieuHienThi = value;
    });
    this.ngayLapBaoCao = `${day}/${month}/${year} ${hours}:${minutes}`;
    this.nam = `${year}`;
  }
 private buildPages() {
  const itemCount = this.allFilteredDoanhThu.length;

  this.totalPages = Math.max(1, Math.ceil(itemCount / this.pageSize));
  this.pageRange = Array.from({ length: this.totalPages }, (_, i) => i + 1);

  // Chia dữ liệu thành từng trang
  this.pagedData = [];
  for (let i = 0; i < this.totalPages; i++) {
    const start = i * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData.push(this.allFilteredDoanhThu.slice(start, end));
  }

  // Reset về trang đầu nếu currentPage bị vượt quá tổng số trang
  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages;
  }

  // Nếu không có dữ liệu thì về trang 1
  if (this.totalPages === 0) {
    this.currentPage = 1;
  }
}

getCurrentPageData(): DoanhThuLoiNhan[] {
  return this.pagedData[this.currentPage - 1] || [];
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

  toggleFullscreen(element: HTMLElement) {
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.error(`Không thể bật toàn màn hình: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // xử lý sự kiện lọc của biểu đồ
  currentFilter: any = {};
 onFilterChange(filter: any) {
  this.currentFilter = { ...filter };
    if (filter.loaiBaoCao === 'Nhân viên') {
    this.hoadonService.getBaoCaoTopNhanVien(filter).subscribe((res) => {
      console.log('📊 DỮ LIỆU DOANH THU NHÂN VIÊN:', res);
      this.allFilteredDoanhThu = res?.data ?? [];
      // Reset tổng khi không dùng
      this.tongSoLuongDon = 0;
      this.tongGiaVon = 0;
      this.tongDoanhThu = 0;
      this.tongPhuThu = 0;
      this.tongLoiNhuan = 0;

      this.buildPages();
    });
  } else {
  
  this.hoadonService.getBaoCaoDoanhThuLoiNhuan(filter).subscribe((res) => {
    console.log('DỮ LIỆU TRẢ VỀ:', res);
  this.allFilteredDoanhThu = res.Data; // ✅ danh sách theo ngày

  // ✅ các tổng từ API
  this.tongSoLuongDon = res.TongSoLuongDon;
  this.tongGiaVon = res.TongGiaVon;
  this.tongDoanhThu = res.TongDoanhThu;
  this.tongPhuThu = res.TongPhuThu;
  this.tongLoiNhuan = res.TongLoiNhuan;

  this.buildPages(); // giữ nguyên
});
  }
}
downloadExcel() {
  debugger
  this.hoadonService.exportExcel(this.currentFilter).subscribe({
    next: (blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;

      // Tạo tên file rõ ràng hơn, fallback nếu `loaiBaoCao` không có
      const fileName = `BaoCao_${this.currentFilter?.loaiBaoCao || 'hoa-don'}_${new Date().toISOString()}.xlsx`;
      a.download = fileName;

      a.click();
      window.URL.revokeObjectURL(blobUrl);
    },
    error: (err) => {
      console.error('❌ Xuất Excel thất bại', err);
    }
  });
}





}
