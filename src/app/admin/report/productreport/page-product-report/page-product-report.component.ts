import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { DisplayService } from '../../display.service';
import { ChartProductComponent } from '../chart-product/chart-product.component';
import { TableProductComponent } from '../table-product/table-product.component';
import { SidebarProductReportComponent } from '../sidebar-product-report/sidebar-product-report.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NhaCungCapService } from '../../../service/nhacungcap.service';
import { BaoCaoHangHoaService } from '../../../service/bao-cao-hang-hoa.service';

@Component({
  selector: 'app-page-product-report',
  imports: [
    ChartProductComponent,
    TableProductComponent,
    SidebarProductReportComponent,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    RouterModule
  ],
  templateUrl: './page-product-report.component.html',
  styleUrl: './page-product-report.component.css'
})
export class PageProductReportComponent {
  @ViewChild('chartProduct') chartProductComponent!: ChartProductComponent;
 @Input() moiQuanTam: string = '';
  kieuHienThi:      string = 'chart';
  zoomLevel:        number = 1;
  currentPage:      number = 1;
  totalPages:       number = 1;
  pageSize:         number = 10;

  selectedInterest = 'ban-hang';
  selectedLoaiBaoCao = 'ban-chay';

  // Cách khuyến nghị: định nghĩa rõ kiểu, thêm 2 trường pageNumber & pageSize
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

  ngayLapBaoCao: string = '';
  nam:           string = '';

  constructor(private displayService: DisplayService, private nhaCungCapService:NhaCungCapService,private baoCaoHangHoaService:BaoCaoHangHoaService) {}

  ngOnInit(): void {
    const now = new Date();
    const day    = String(now.getDate()).padStart(2, '0');
    const month  = String(now.getMonth() + 1).padStart(2, '0');
    const year   = now.getFullYear();
    const hours  = String(now.getHours()).padStart(2, '0');
    const minutes= String(now.getMinutes()).padStart(2, '0');

    this.displayService.currentDisplayType.subscribe(value => {
      this.kieuHienThi = value;
    });

    this.ngayLapBaoCao = `${day}/${month}/${year} ${hours}:${minutes}`;
    this.nam = `${year}`;
  }

  reload() {
    this.kieuHienThi = '';
    setTimeout(() => {
      this.kieuHienThi = 'report';
    }, 0);
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

  // Khi chuyển trang, cập nhật pageNumber & pageSize vào filter rồi component con sẽ tự gọi lại API
  updatePageView() {
    console.log(`Đang ở trang ${this.currentPage}`);
    this.currentFilter.pageNumber = this.currentPage;
    this.currentFilter.pageSize   = this.pageSize;
    this.currentFilter = { ...this.currentFilter };
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.updatePageView();
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePageView();
  }

  goToPage(event: any) {
    const page = parseInt(event.target.value, 10);
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePageView();
    }
  }

  showExportMenu = false;

  toggleExportMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showExportMenu = !this.showExportMenu;
  }

  downloadPDF() {
    const content = document.querySelector('.content') as HTMLElement;
    if (!content) return;

    html2canvas(content, { scale: 2 }).then(canvas => {
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

  @HostListener('document:click')
  onDocumentClick() {
    this.showExportMenu = false;
  }
downloadExcel() {
  const fullFilter = {
    ...this.currentFilter,
    moiQuanTam: this.selectedInterest,
    kieuHienThi: this.kieuHienThi
  };

  this.baoCaoHangHoaService.exportExcel(fullFilter).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BaoCao_${this.selectedInterest}_${new Date().toISOString()}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, err => {
    console.error('Xuất Excel thất bại', err);
  });
}

  printPage() {
    const content = document.querySelector('.content') as HTMLElement;
    if (!content) return;

    html2canvas(content, { scale: 2 }).then(canvas => {
      const dataUrl = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Báo cáo bán hàng</title>
            <style>
              body, html { margin: 0; padding: 0; text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" />
            <script>
              window.onload = function() { window.print(); };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  }

  toggleFullscreen(element: HTMLElement) {
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        console.error(`Không thể bật toàn màn hình: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  onTotalChanged(totalItems: number) {
    this.totalPages = Math.ceil(totalItems / this.pageSize);
  }

  getTieuDeBaoCao(): string {
    switch (this.selectedInterest) {
      case 'ban-hang': return 'Báo cáo hàng hóa theo bán hàng';
      case 'sua-chua': return 'Báo cáo hàng hóa theo sửa chữa';
      case 'loi-nhuan': return 'Báo cáo hàng hóa theo lợi nhuận';
      case 'gia-tri-kho': return 'Báo cáo hàng hóa theo giá trị kho';
      case 'xuat-nhap-ton': return 'Báo cáo hàng hóa theo xuất nhập tồn';
      case 'xuat-nhap-ton-chi-tiet': return 'Báo cáo hàng hóa chi tiết xuất nhập tồn';
      case 'ncc-theo-hang-nhap': return 'Báo cáo hàng hóa theo nhà cung cấp';
      default: return 'Báo cáo hàng hóa';
    }
  }

  onFilterChange(event: any) {
    console.log('Nhận dữ liệu từ sidebar:', event);
    this.selectedInterest = event.moiQuanTam;
    this.kieuHienThi   = event.kieuHienThi;
    
    // Khi sidebar thay đổi filter, ta cũng cài lại pageNumber/pageSize mặc định
    this.currentFilter = {
      ...event.filter,
      pageNumber: 1,
      pageSize: this.pageSize
    };
    this.currentPage = 1;
    if (this.kieuHienThi === 'chart') {
      this.chartProductComponent.loadBanChayVaTieuThu();
    }
    
  }
}
