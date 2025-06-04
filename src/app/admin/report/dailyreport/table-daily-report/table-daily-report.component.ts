import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoHoaDon, BaoCaoThuChi } from '../../../model/model.component';
import { HoaDonService } from '../../../service/hoadon.service';

@Component({
  selector: 'app-table-daily-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-daily-report.component.html',
  styleUrls: ['./table-daily-report.component.css'],
})
export class TableDailyReportComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() selectedInterest!: string;
  @Input() tongSoHoaDon: number = 0;
  @Input() tongTienTatCa: number = 0;
  @Input() todayLabel: string = '';
  @Input() displayRange: string = '';
  @Input() tongSoPhieu: number = 0;
  @Input() tongTienThu: number = 0;
  @Input() tongTienChi: number = 0;
  @Input() soPhieuThu: number = 0;
  @Input() soPhieuChi: number = 0;
  @Input() tongTien: number = 0;

  filteredHoaDons: any[] = [];
  selectedHoaDon: BaoCaoHoaDon | null = null;
  selectedHoaDonDetail: any = null;

  constructor(private hoadonService: HoaDonService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['selectedInterest']) {
      this.filterData();
      console.log('Tổng hóa đơn:', this.tongSoHoaDon);
      console.log('Tổng tiền:', this.tongTienTatCa);
    }
  }

  filterData() {
    if (!this.data) {
      this.filteredHoaDons = [];
      return;
    }

    switch (this.selectedInterest) {
      case 'Hóa đơn bán hàng':
        this.filteredHoaDons = this.data.filter((h) => h.Loai === 'Bán hàng');
        break;
      case 'Hóa đơn sửa chữa':
        this.filteredHoaDons = this.data.filter((h) => h.Loai === 'Sửa chữa');
        break;
      case 'Thu chi':
        this.filteredHoaDons = []; // chưa có
        break;
      default:
        this.filteredHoaDons = this.data;
        break;
    }
  }

  toggleDetail(open: boolean, hd: BaoCaoHoaDon) {
    if (!open) {
      this.selectedHoaDon = null;
      this.selectedHoaDonDetail = null;
      return;
    }

    this.selectedHoaDon = hd;
    console.log('Xem chi tiết hóa đơn:', hd.MaHoaDon, 'Loại:', hd.Loai);

    if (hd.Loai === 'Bán hàng') {
      this.hoadonService.getChiTietBanHang(hd.MaHoaDon!).subscribe({
        next: (res: any) => {
          console.log('Chi tiết bán hàng:', res); // ✅ THÊM DÒNG NÀY
          this.selectedHoaDonDetail = res;
        },
        error: (err: any) => {
          console.error('Lỗi chi tiết bán hàng:', err);
        },
      });
    } else if (hd.Loai === 'Sửa chữa') {
      this.hoadonService.getChiTietSuaChua(hd.MaHoaDon!).subscribe({
        next: (res: any) => {
          console.log('Chi tiết sửa chữa:', res);
          this.selectedHoaDonDetail = res;
        },
        error: (err: any) => {
          console.error('Lỗi chi tiết sửa chữa:', err);
        },
      });
    }
  }
}
