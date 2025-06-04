// ✅ chart-product.component.ts - HOÀN CHỈNH
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { BaoCaoHangHoaService } from '../../../service/bao-cao-hang-hoa.service';

@Component({
  selector: 'app-chart-product',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, FormsModule],
  templateUrl: './chart-product.component.html',
  styleUrl: './chart-product.component.css'
})
export class ChartProductComponent implements OnChanges {
  @Input() moiQuanTam: string = '';
  @Input() loaiBaoCao: string = '';
  @Input() filter: any;
  @Input() kieuHienThi: string = '';

  view: [number, number] = [1120, 470];
  revenueData: any[] = [];
  chart2Data: any[] = [];
  titleChart1: string = '';
  titleChart2: string = '';
  
  colorSchemeChart2: Color = {
  name: 'chart2Scheme',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: ['#b2f7ef', '#9df3c4', '#87dfd6']
};

  constructor(private baoCaoService: BaoCaoHangHoaService) {}
ngOnInit(): void {
  this.loadChartData();
}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['moiQuanTam'] || changes['filter'] || changes['loaiBaoCao']) {
      this.loadChartData();
    }
  }

  loadChartData() {
    console.log(' moiQuanTam:', this.moiQuanTam);
    console.log(' kieuHienThi:', this.kieuHienThi);
    console.log(' filter:', this.filter);
    switch (this.moiQuanTam) {
      case 'ban-hang':
        this.titleChart1 = 'Top 10 sản phẩm bán chạy nhất';
        this.titleChart2 = 'Top 10 sản phẩm tiêu thụ nhiều nhất';
        this.loadBanChayVaTieuThu();
      break;
      case 'loi-nhuan':
        this.titleChart1 = 'Top 10 sản phẩm có lợi nhuận cao nhất';
        this.titleChart2 = 'Top 10 sản phẩm có lợi nhuận thấp nhất';

         const filterLoiNhuan = {
        ...this.filter,
        moiQuanTam: 'loi-nhuan',
        kieuHienThi: 'chart'
        };
        console.log(' [API] getLoiNhuan → filter:', filterLoiNhuan);

       this.baoCaoService.getLoiNhuan(filterLoiNhuan).subscribe(res => {
          const sorted = [...res.data].sort((a, b) => b.LoiNhuan - a.LoiNhuan);
            this.revenueData = this.formatData(sorted.slice(0, 10));
            this.chart2Data = this.formatData(sorted.reverse().slice(0, 10));
        });

      break;

      case 'gia-tri-kho':
        this.titleChart1 = 'Top sản phẩm có giá trị tồn kho cao nhất';
        this.titleChart2 = 'Top sản phẩm có giá trị tồn kho thấp nhất';

        this.baoCaoService.getGiaTriKho({
          ...this.filter,
          moiQuanTam: 'gia-tri-kho',
          kieuHienThi: 'chart'
        }).subscribe(res => {
          const sorted = [...res.data].sort((a, b) => b.GiaTriTon - a.GiaTriTon);
          this.revenueData = this.formatData(sorted.slice(0, 10));
          this.chart2Data = this.formatData(sorted.reverse().slice(0, 10));
        });
      break;

      case 'xuat-nhap-ton':
        this.titleChart1 = 'Top tồn kho cao nhất';
        this.titleChart2 = 'Top tồn kho thấp nhất';
        this.baoCaoService.getXuatNhapTonChart({
          ...this.filter,
          moiQuanTam: 'xuat-nhap-ton',
          kieuHienThi: 'chart'
        }).subscribe(res => {
          console.log('👉 raw TopTonCaoNhat:', res?.TopTonCaoNhat);
          this.revenueData = this.formatData(res?.TopTonCaoNhat || []);
          this.chart2Data = this.formatData(res?.TopTonThapNhat || []);
          console.log('formatted revenueData:', this.revenueData);
          console.log('formatted chart2Data:', this.chart2Data);
        });
        break;

      case 'ncc-theo-hang-nhap':
        this.titleChart1 = 'Top nhà cung cấp có giá trị nhập hàng cao nhất';
        this.titleChart2 = 'Top nhà cung cấp có giá trị nhập hàng thấp nhất';

        this.baoCaoService.getNCCTheoHangNhap({
          ...this.filter,
          moiQuanTam: 'ncc-theo-hang-nhap',
          kieuHienThi: 'chart'
        }).subscribe(res => {
          const sorted = [...res.data].sort((a, b) => b.TongTien - a.TongTien);
          this.revenueData = this.formatData(sorted.slice(0, 10));
          this.chart2Data = this.formatData(sorted.reverse().slice(0, 10));
        });
      break;

      case 'sua-chua':
        this.titleChart1 = 'Top 10 dịch vụ sử dụng nhiều nhất';
        this.titleChart2 = 'Top 10 phụ tùng thay thế được dùng nhiều nhất';
        this.baoCaoService.getSuaChua({ ...this.filter, moiQuanTam: this.moiQuanTam, kieuHienThi: this.kieuHienThi }).subscribe(res => {
          this.revenueData = this.formatData(res?.topDichVu || []);
          this.chart2Data = this.formatData(res?.topPhuTung || []);
        });
        break;
      case 'xuat-nhap-ton-chi-tiet':
  this.titleChart1 = 'Top 10 hàng hóa nhập nhiều nhất';
  this.titleChart2 = 'Top 10 hàng hóa xuất nhiều nhất';

  this.baoCaoService.getXuatNhapTonChiTiet({ ...this.filter, moiQuanTam: 'xuat-nhap-ton-chi-tiet', kieuHienThi: 'chart' }).subscribe(res => {
    // Nhập
    const nhap = res.filter(x => x.Loai === 'Nhập hàng');
    const nhapGrouped = this.groupByProduct(nhap);
    const topNhap = nhapGrouped.sort((a, b) => b.SoLuong - a.SoLuong).slice(0, 10);
    this.revenueData = this.formatGroupedData(topNhap);

    // Xuất (gồm Bán hàng + Sửa chữa)
    const xuat = res.filter(x => x.Loai === 'Bán hàng' || x.Loai === 'Sửa chữa');
    const xuatGrouped = this.groupByProduct(xuat);
    const topXuat = xuatGrouped.sort((a, b) => b.SoLuong - a.SoLuong).slice(0, 10);
    this.chart2Data = this.formatGroupedData(topXuat);
  });
  break;

    }
  }

  loadBanChayVaTieuThu() {
    debugger
    console.log('📤 filter gửi lên:', this.filter); 
    this.baoCaoService.getTopBanChay({
  ...this.filter,
  kieuHienThi: this.kieuHienThi,
  moiQuanTam: this.moiQuanTam,
  loaiBaoCao: 'ban-chay'
}).subscribe(res1 => {
  this.revenueData = this.formatData(res1);
});

this.baoCaoService.getTopTieuThu({
  ...this.filter,
  kieuHienThi: this.kieuHienThi,
  moiQuanTam: this.moiQuanTam,
  loaiBaoCao: 'tieu-thu'
}).subscribe(res2 => {
  this.chart2Data = this.formatData(res2);
});

  }

 formatData(data: any[]): any[] {
  return data
    .map((item: any) => {
      const name =
        item.TenSanPham || item.Ten || item.TenNCC || 'Không rõ';

      const soLuong =
        item.SoLuong ?? item.TongSoLuong ?? item.TonKho ?? 0;

      const giaTri =
        item.LoiNhuan ?? item.DoanhThu ?? item.TongTien ?? item.GiaTriTon ?? item.TonKho ?? item.SoLuong ?? 0;

      return {
        name: `${name}\nSố lượng: ${soLuong}\nTổng: ${this.formatCurrency(giaTri)}`,
        value: giaTri
      };
    })
    .filter(item => item.value > 0); // Bỏ những item không có giá trị
}



  formatCurrency(amount: number | undefined): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';

  return amount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  });
}


  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Tổng tiền (VND)';
  showYAxisLabel = true;
  yAxisLabel = 'Tên';
  yAxisTickFormatting = (value: string): string => value;

  xAxisTickFormatting = (value: number): string => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' tr';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'k';
    return value.toString();
  };

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#0aaf96', '#0c9983', '#0cc1a8', '#087d6f', '#1ed7bc', '#0aaf96aa']
  };

  groupByProduct(data: any[]): { TenSanPham: string, SoLuong: number }[] {
  const result: { [key: string]: number } = {};

  data.forEach(item => {
    if (!result[item.TenSanPham]) result[item.TenSanPham] = 0;
    result[item.TenSanPham] += item.SoLuong;
  });

  return Object.keys(result).map(name => ({ TenSanPham: name, SoLuong: result[name] }));
}

formatGroupedData(data: any[]): any[] {
  return data.map(item => ({
    name: `${item.TenSanPham}\nSố lượng: ${item.SoLuong}`,
    value: item.SoLuong
  }));
}

}
