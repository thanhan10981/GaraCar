// chart-sell.component.ts
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HoaDonService } from '../../../service/hoadon.service';
import { DoanhThuPhuTung } from '../../../model/model.component';
import { LoiNhuanPhuTung } from '../../../model/model.component';

@Component({
  selector: 'app-chart-sell',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, FormsModule],
  templateUrl: './chart-sell.component.html',
  styleUrl: './chart-sell.component.css'
})
export class ChartSellComponent implements OnInit {
  view: [number, number] = [1120, 470];
  revenueData: { name: string; value: number }[] = [];
  @Input() filter: any;
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Ngày';
  showYAxisLabel = true;
  yAxisLabel = 'Doanh thu';
  
  // Tiêu đề biểu đồ sẽ thay đổi theo filter được chọn (ví dụ: hôm nay, tuần này, tháng này...)
  chartTitle: string = 'Biểu đồ doanh thu phụ tùng theo tuần';

  // Định dạng giá trị trục Y (ví dụ: 1tr, 200k)
  yAxisTickFormatting = (value: number): string => {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' tr';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(0) + 'k';
    }
    return value.toString();
  };

  // Màu cho biểu đồ cột
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#0aaf96', '#0c9983', '#0cc1a8', '#087d6f', '#1ed7bc', '#0aaf96aa']
  };

  colorSchemeLoiNhuan: Color = {
  name: 'loiNhuan',
  selectable: true,
  group: ScaleType.Ordinal,
domain: ['#b2f7ef', '#9df3c4', '#87dfd6']
};

  // Các filter gửi đi API doanh thu phụ tùng từ giao diện sidebar hoặc mặc định
  thoiGian: string = 'Tuần này';
  tuNgay: string = '';
  denNgay: string = '';
  phuongThucThanhToan: string = ''; // Ví dụ: "Tiền mặt", "Chuyển khoản"
  kieuBanHang: string = '';         // Ví dụ: "Online", "Trực tiếp"

  constructor(private hoadonService: HoaDonService) {}

  ngOnInit(): void {
    this.getRevenueData();
  }

  // Gọi API .NET Core để lấy dữ liệu doanh thu phụ tùng đã xử lý backend theo thời gian + lọc
  getRevenueData() {

    let params = new HttpParams();

    // Nếu người dùng chọn thời gian nhanh như "Tuần này", "Tháng này", "Hôm nay"...
    if (this.thoiGian && this.thoiGian !== 'Lựa chọn khác') {
      params = params.set('thoiGian', this.thoiGian);
    }

    // Nếu người dùng chọn khoảng ngày cụ thể (custom)
    if (this.thoiGian === 'Lựa chọn khác' && this.tuNgay && this.denNgay) {
      params = params.set('tuNgay', this.tuNgay);
      params = params.set('denNgay', this.denNgay);
    }

    if (this.phuongThucThanhToan) {
      params = params.set('phuongThucThanhToan', this.phuongThucThanhToan);
    }

    if (this.kieuBanHang) {
      params = params.set('kieuBanHang', this.kieuBanHang);
    }
if (this.filter?.loaiBaoCao === 'Nhân viên') {
    this.getTopNhanVienChartData(params);
  }
 if (this.filter?.loaiBaoCao === 'Lợi nhuận') {
  this.yAxisLabel = 'Lợi nhuận';
   this.colorScheme = this.colorSchemeLoiNhuan;
  this.hoadonService.getLoiNhuanPhuTung(params).subscribe(
    (data) => {
      this.revenueData = data.map(item => ({
        name: item.Ngay,
        value: item.LoiNhuan // ✅ Sử dụng đúng key lợi nhuận
      }));
    },
    (error) => {
      console.error('Lỗi khi lấy dữ liệu lợi nhuận phụ tùng:', error);
    }
  );
} else {
  this.yAxisLabel = 'Doanh thu';
  this.colorScheme = this.colorScheme;
  this.hoadonService.getDoanhThuPhuTung(params).subscribe(
    (data) => {
      this.revenueData = data.map(item => ({
        name: item.Ngay,
        value: item.TongTien  // ✅ Sử dụng đúng key doanh thu
      }));
    },
    (error) => {
      console.error('Lỗi khi lấy dữ liệu doanh thu phụ tùng:', error);
    }
  );
}


}
ngOnChanges(changes: SimpleChanges): void {
  debugger
  if (changes['filter'] && this.filter) {
    const {
      thoiGian = '',
      tuNgay = '',
      denNgay = '',
      phuongThucThanhToan = '',
      kieuBanHang = '',
      loaiBaoCao = ''
    } = this.filter;
      console.log('⏰ Gửi API với:', {
      thoiGian,
      tuNgay,
      denNgay,
      phuongThucThanhToan,
      kieuBanHang,
      loaiBaoCao
    });
    this.updateFilters(thoiGian, tuNgay, denNgay, phuongThucThanhToan, kieuBanHang, loaiBaoCao);
  }
}

  // Hàm này được gọi mỗi khi người dùng chọn lại filter từ sidebar
  updateFilters(thoiGian: string, tuNgay: string, denNgay: string, phuongThuc: string, kieuBan: string, loaiBaoCao: string) {
    this.thoiGian = thoiGian;
    this.tuNgay = tuNgay;
    this.denNgay = denNgay;
    this.phuongThucThanhToan = phuongThuc;
    this.kieuBanHang = kieuBan;
    this.filter.loaiBaoCao = loaiBaoCao;

    this.getRevenueData();
    this.updateChartTitle(thoiGian);

  }

 private updateChartTitle(thoiGian: string) {
  if (this.filter?.loaiBaoCao === 'Nhân viên') {
    this.chartTitle = 'Top 10 nhân viên có doanh thu cao nhất';
    return;
  }

  const prefix = this.filter?.loaiBaoCao === 'Lợi nhuận'
    ? 'Biểu đồ lợi nhuận phụ tùng'
    : 'Biểu đồ doanh thu phụ tùng';

  if (!thoiGian) {
    this.chartTitle = prefix;
  } else if (thoiGian === 'Lựa chọn khác') {
    this.chartTitle = `${prefix} theo ngày`;
  } else {
    this.chartTitle = `${prefix} theo ${thoiGian.toLowerCase()}`;
  }
}


getTopNhanVienChartData(params: HttpParams) {
  this.yAxisLabel = 'Doanh thu'; // hoặc 'Lợi nhuận' nếu bạn muốn
  this.colorScheme = this.colorScheme; // hoặc custom màu riêng

  this.hoadonService.getBaoCaoTopNhanVien(params).subscribe(
    (res: any) => {
      this.revenueData = res.data.map((nv: any) => ({
        name: nv.TenNhanVien,
        value: nv.TongDoanhThu // hoặc nv.TongLoiNhuan nếu cần
      }));
      this.chartTitle = 'Top 10 nhân viên có doanh thu cao nhất';
    },
    (error) => {
      console.error('Lỗi khi lấy dữ liệu top nhân viên:', error);
    }
  );
}


}
