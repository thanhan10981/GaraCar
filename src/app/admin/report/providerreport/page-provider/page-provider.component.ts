import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { DisplayService } from '../../display.service';
import { TableProviderComponent } from '../table-provider/table-provider.component';
import { SidebarProviderComponent } from '../sidebar-provider/sidebar-provider.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BaocaotaichinhService } from '../../../service/baocaotaichinh.service';
import { NhaCungCapService } from '../../../service/nhacungcap.service';


@Component({
  selector: 'app-page-provider',
  imports: [
    TableProviderComponent,
    SidebarProviderComponent,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    RouterModule
  ],
  templateUrl: './page-provider.component.html',
  styleUrl: './page-provider.component.css'
})
export class PageProviderComponent {
  @ViewChild('tableReport', { static: false }) tableReport!: any;

  kieuHienThi: string = 'report';
  zoomLevel: number = 1;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  selectedInterest = 'nhap-hang';
  @Input() filter!: any;
  @Input() moiQuanTam!: string;
  currentFilter: any = {
    thoiGian: 'Tháng này',
    tuNgay: '',
    denNgay: '',
    maNhaCungCap: '',
    pageNumber: 1,
    pageSize: 10
  };

  ngayLapBaoCao: string = '';
  nam: string = '';
  showExportMenu = false;

  constructor(private displayService: DisplayService, private nhaCungCapService:NhaCungCapService) {}

  ngOnInit(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

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

  updatePageView() {
    this.currentFilter.pageNumber = this.currentPage;
    this.currentFilter.pageSize = this.pageSize;
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
      pdf.save('bao-cao-nha-cung-cap.pdf');
      this.showExportMenu = false;
    });
  }
downloadExcelNhaCungCap() {
  this.nhaCungCapService.exportBaoCaoNhaCungCap(this.currentFilter).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BaoCaoNhaCungCap_${new Date().toISOString()}.xlsx`;
    a.click();
  }, error => {
    console.error('Lỗi khi xuất file Excel:', error);
  });
}
  @HostListener('document:click')
  onDocumentClick() {
    this.showExportMenu = false;
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
            <title>Báo cáo nhà cung cấp</title>
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
      case 'nhap-hang': return 'Báo cáo nhập hàng theo nhà cung cấp';
      case 'cong-no': return 'Báo cáo công nợ theo nhà cung cấp';
      case 'hang-nhap-theo-ncc': return 'Báo cáo danh sách nhập hàng theo nhà cung cấp';
      default: return 'Báo cáo nhập hàng theo nhà cung cấp';
    }
  }

  onFilterChange(event: any) {
    console.log('📥 Nhận filter từ sidebar:', event);
    this.selectedInterest = event.moiQuanTam;
    this.kieuHienThi = event.kieuHienThi;
    this.currentPage = 1;
    this.currentFilter = {
      ...event.filter,
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };
  }
  


}
