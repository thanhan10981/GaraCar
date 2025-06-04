import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoaDonService } from '../../../service/hoadon.service';
import { DoanhThuLoiNhan, SanPhamChiTiet } from '../../../model/model.component';

@Component({
  selector: 'app-table-sell',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './table-sell.component.html',
  styleUrls: ['./table-sell.component.css']
})
export class TableSellComponent {
  @Input() datadanhthu: any[] = [];
  @Input() tongSoLuongDon = 0;
  @Input() tongGiaVon = 0;
  @Input() tongDoanhThu = 0;
  @Input() tongPhuThu = 0;
  @Input() tongLoiNhuan = 0;
  @Input() loaiBaoCao: string = '';


  selectedIndex: number | null = null;
  chiTiet: SanPhamChiTiet[] = [];
  hasData: boolean = true;
  chiTietNhanVien: any = null;
  constructor(private hoadonService: HoaDonService) {}

  toggleDetail(index: number, ngay: string) {
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
      return;
    }

    this.selectedIndex = index;

    const from = new Date(ngay);
    const to = new Date(ngay);
    to.setHours(23, 59, 59, 999);

    this.hoadonService.getChiTietTheoKhoangNgay(from.toISOString(), to.toISOString())
      .subscribe((res) => {
        this.chiTiet = res;
      });
  }
  toggleNhanVienDetail(index: number, maNhanVien: string) {
  if (this.selectedIndex === index) {
    this.selectedIndex = null;
    this.chiTietNhanVien = null;
    return;
  }

  this.selectedIndex = index;

  this.hoadonService.getBaoCaoTopNhanVien({ maNhanVien }).subscribe((res) => {
    this.chiTietNhanVien = res;
  });
}
}
