 import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  ViewChild,
  Input,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { SidebarDailyReportComponent } from '../sidebar-daily-report/sidebar-daily-report.component';
import { TableDailyReportComponent } from '../table-daily-report/table-daily-report.component';
import { DisplayService } from '../../display.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as FileSaver from 'file-saver';
import { RouterModule } from '@angular/router';
import * as ExcelJS from 'exceljs';
import { BaoCaoHoaDon } from '../../../model/model.component';
import { HoaDonService } from '../../../service/hoadon.service';
import { KhachHangService } from '../../../service/khachhang.service';
import { KhachHang } from '../../../model/model.component';

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    TableDailyReportComponent,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    SidebarDailyReportComponent,
    RouterModule,
  ],

  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css'],
})
// daily-report.component.ts
export class DailyReportComponent implements OnInit {
  kieuHienThi: string = 'report';
  zoomLevel: number = 1;
  rotate: number = 0;
  totalPages: number = 1;
  currentPage: number = 1;
  tableReportComponent: any;
  selectedLoaiBaoCao: string = 'Tổng Hóa Đơn';
  pageRange: number[] = [];
  allHoaDons: BaoCaoHoaDon[] = [];
  pageSize = 12; // số dòng trên mỗi trang
  pagedData: BaoCaoHoaDon[][] = [];
  displayDate: string = ''; 
  displayRange: string = ''; //cho custom range
  currentTimeFilter: any = null;
  allFilteredHoaDons: BaoCaoHoaDon[] = [];
  currentDateFilter: Date | null = null;
dateRangeFilter: { start: Date, end: Date } | null = null;
timeFilter: { tuGio: string, denGio: string } | null = null;
khachHangs: KhachHang[] = [];
khachHangMap: { [ma: string]: string } = {};
nhanVienFilter: string = '';
nguoiTaoHienThi: string = '';
phuongThucFilter: string = '';
tongSoHoaDon: number = 0;
tongTienTatCa: number = 0;



  filters = {
    loai: '',
    tuNgay: null as Date | null,
    denNgay: null as Date | null,
    tuGio: '',
    denGio: '',
    khachHang: '',
    nhanVien: '',
  };
  onSelectedInterestChanged(value: string) {
    this.selectedLoaiBaoCao = value;
  }

  constructor(
    private displayService: DisplayService,
    private hoadonService: HoaDonService,
    private KhachHangService: KhachHangService
  ) {}
  ngayLapBaoCao: string = '';
  nam: string = '';
  ngOnInit(): void {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); 
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  this.displayDate = `${day}/${month}/${year}`;
  this.ngayLapBaoCao = `${day}/${month}/${year} ${hours}:${minutes}`;
  this.nam = `${year}`;
  const today = new Date(new Date().toDateString()); // 00:00:00 hôm nay
  this.applyTimeFilter({
    type: 'today',
    date: today,
    endDate: today,
    fromTime: '00:00',
    toTime: '23:59'
  });
   setTimeout(() => {
    this.loadDataFromApi();
  }, 0);
// lọc khách 
  this.KhachHangService.getAll().subscribe(data => {
    this.khachHangs = data;
    this.khachHangMap = {};

    for (const kh of this.khachHangs) {
      this.khachHangMap[kh.MaKhachHang] = kh.TenKhachHang;
    }


 
  });
}
onNguoiTaoFilterChanged(tenNguoiTao: string) {
  this.nguoiTaoHienThi = tenNguoiTao;
  this.loadDataFromApi(); // Gọi API nếu cần
}
//lọc phương thức
onPhuongThucFilterChanged(pt: string) {
  this.phuongThucFilter = pt;
  this.loadDataFromApi();
}
  onFilterChange(): void {
    this.loadDataFromApi();
  }
  private initDateInfo(): void {
  const now = new Date();
  
  // Định dạng ngày tháng
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  // Thiết lập các biến hiển thị
  this.displayDate = `${day}/${month}/${year}`;
  this.ngayLapBaoCao = `${day}/${month}/${year} ${hours}:${minutes}`;
  this.nam = year.toString();
}
  formatDate(d: Date) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  }

   getTodayLabel() {
    return this.formatDate(new Date());
  }

   private buildPages() {
  const itemCount = this.allFilteredHoaDons.length; // Sửa từ allHoaDons sang allFilteredHoaDons
  this.totalPages = Math.max(1, Math.ceil(itemCount / this.pageSize));
  this.pageRange = Array.from({ length: this.totalPages }, (_, i) => i + 1);

  this.pagedData = Array.from({ length: this.totalPages }, (_, i) => {
    const start = i * this.pageSize;
    return this.allFilteredHoaDons.slice(start, start + this.pageSize); // Sửa từ allHoaDons sang allFilteredHoaDons
  });

  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages;
  }
}
  getCurrentPageData(): BaoCaoHoaDon[] {
    return this.pagedData[this.currentPage - 1] || [];
  }

   getPageData(page: number): BaoCaoHoaDon[] {
    return this.pagedData[page - 1] || [];
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

  @ViewChild('wordContent') wordContentRef!: ElementRef;

  downloadPDF() {
    const content = document.querySelector('.content') as HTMLElement;
    if (!content) return;

    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Tạo đối tượng ảnh để lấy kích thước
      const img = new Image();
      img.src = imgData;

      img.onload = () => {
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('bao-cao-ban-hang.pdf');
        this.showExportMenu = false;
      };
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
      'Mã giao dịch',
      'thời gian',
      'SL',
      'Doanh thu',
      'Thu khác',
      'VAT',
      'Phí trả hàng',
      'Thực thu',
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
    worksheet.addRow(['HD00049', '21:17', 3, '3897000', 0, 0, 0, '3897000']);

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

  get reportTitle(): string {
    switch (this.selectedLoaiBaoCao) {
      case 'Hóa đơn bán hàng':
        return 'Báo cáo cuối ngày bán hàng';
      case 'Hóa đơn sửa chữa':
        return 'Báo cáo cuối ngày sửa chữa';
      case 'Thu chi':
        return 'Báo cáo cuối ngày thu chi';
      default:
        return 'Báo cáo cuối ngày tổng hóa đơn';
    }
  }

  // gọi khi sidebar emit dateChange
  onDateChange(value: string) {
    // nếu có dấu " - " xem như range
    if (value.includes(' - ')) {
      this.displayRange = value;
      this.displayDate  = '';    // ẩn single-day
    } else {
      this.displayDate  = value;
      this.displayRange = '';    // ẩn range
    }
  }

 applyTimeFilter(filter: any) {
  if (filter.type === 'today') {
    this.currentDateFilter = new Date(filter.date);
    this.dateRangeFilter = null;
  } else if (filter.type === 'custom') {
    this.currentDateFilter = null;
    this.dateRangeFilter = {
      start: new Date(filter.date),
      end: new Date(filter.endDate)
    };
  }

  // ✅ Sửa ở đây: giữ đúng key là tuGio / denGio cho API
  this.timeFilter = {
    tuGio: filter.fromTime,
    denGio: filter.toTime
  };

  this.loadDataFromApi();
}


loadDataFromApi() {
  const params: any = {};

  // loại
  if (this.selectedLoaiBaoCao !== 'Tổng Hóa Đơn') {
    params.loai = this.selectedLoaiBaoCao === 'Hóa đơn bán hàng' ? 'bán hàng'
                 : this.selectedLoaiBaoCao === 'Hóa đơn sửa chữa' ? 'sửa chữa'
                 : '';
  }

  const now = new Date();
  if (!this.currentDateFilter && !this.dateRangeFilter) {
    const today = new Date(now.toDateString()); // reset giờ về 00:00
   params.ngay = today.toLocaleDateString('sv-SE'); // 'yyyy-MM-dd'

    params.tuGio = '00:00';
    params.denGio = '23:59';
  } else if (this.currentDateFilter) {
    params.ngay = this.currentDateFilter.toISOString();
    if (this.timeFilter?.tuGio) params.tuGio = this.timeFilter.tuGio;
    if (this.timeFilter?.denGio) params.denGio = this.timeFilter.denGio;
  } else if (this.dateRangeFilter) {
    params.tuNgay = this.dateRangeFilter.start.toISOString();
    params.denNgay = this.dateRangeFilter.end.toISOString();
    if (this.timeFilter?.tuGio) params.tuGio = this.timeFilter.tuGio;
    if (this.timeFilter?.denGio) params.denGio = this.timeFilter.denGio;
  }


  // khách hàng
  if (this.khachHangKeyword) {
    params.khachHang = this.khachHangKeyword;
  }

  if (this.nhanVienFilter) {
  params.nhanVien = this.nhanVienFilter;
}
// gửi ng tạo theo mã (mã) lên api
if (this.nguoiTaoHienThi) {
  params.nguoiTao = this.nguoiTaoHienThi;
}
// gửi phương thức thanh toán vào api
if (this.phuongThucFilter) {
  params.phuongThucThanhToan = this.phuongThucFilter;
}

  // gọi API
 this.hoadonService.getTongHopHoaDon(params).subscribe({
    next: (res) => {
      const data = res.HoaDons;
       console.log('DỮ LIỆU API:', res);
      this.tongSoHoaDon = res.TongSoHoaDon;
      this.tongTienTatCa = res.TongTienTatCa;

      data.forEach(d => d.ThoiGian = new Date(d.ThoiGian));
      this.allHoaDons = data;
      this.allFilteredHoaDons = data;
      this.buildPages();
    },
    error: (err) => console.error('Lỗi tải dữ liệu theo bộ lọc', err)
  });

}

  
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

// Lọc khách hàng
khachHangKeyword: string = '';
onKhachHangFilterChanged(keyword: string) {
    this.khachHangKeyword = keyword;
    this.loadDataFromApi();
  }

  //lọc nhân viên
  onNhanVienFilterChanged(maNV: string) {
  this.nhanVienFilter = maNV;
  this.loadDataFromApi(); // gọi lại API
}
  
}
