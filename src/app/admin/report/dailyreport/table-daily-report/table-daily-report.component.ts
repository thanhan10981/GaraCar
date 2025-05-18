// table-daily-report.component.ts
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoHoaDon } from '../../../model/model.component';
import { HoaDonService } from '../../../service/hoadon.service';

@Component({
  selector: 'app-table-daily-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-daily-report.component.html',
  styleUrls: ['./table-daily-report.component.css']
})
export class TableDailyReportComponent implements OnInit {

  @Input() data: BaoCaoHoaDon[] = [];
  @Input() selectedInterest!: string;
  hoaDons: BaoCaoHoaDon[] = [];
  filteredHoaDons: BaoCaoHoaDon[] = [];
  selectedHoaDon: BaoCaoHoaDon | null = null;
  hasData = false;

  constructor(private hoadonService: HoaDonService) {}

  ngOnInit(): void {
  this.hoadonService.getTongHopHoaDon().subscribe(data => {
    this.hoaDons = data;
    this.filterData();
 });
}
ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['selectedInterest']) {
      this.filterData();
    }
  }

filterData() {
    if (!this.data) {
      this.filteredHoaDons = [];
      return;
    }

    switch (this.selectedInterest) {
      case 'Hóa đơn bán hàng':
        this.filteredHoaDons = this.data.filter(h => h.Loai === 'BanHang');
        break;
      case 'Hóa đơn sửa chữa':
        this.filteredHoaDons = this.data.filter(h => h.Loai === 'SuaChua');
        break;
      case 'Thu chi':
        this.filteredHoaDons = []; // chưa có API
        break;
      default:
        this.filteredHoaDons = this.data; // Tổng hợp
        break;
    }
  }
  /** Mở/đóng detail row cho từng hoá đơn */
  toggleDetail(open: boolean, hd: BaoCaoHoaDon) {
    this.selectedHoaDon = open ? hd : null;
  }
}



