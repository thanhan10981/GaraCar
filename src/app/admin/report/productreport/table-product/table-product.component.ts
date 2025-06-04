import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoHangHoaService } from '../../../service/bao-cao-hang-hoa.service';
import { BaoCaoHangHoaBanHang, BaoCaoHangHoaGiaTriKho, BaoCaoHangHoaNhaCungCapNhap, BaoCaoHangHoaXuatNhapTon } from '../../../model/model.component';

@Component({
  selector: 'app-table-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-product.component.html',
  styleUrl: './table-product.component.css'
})
export class TableProductComponent {
  @Input() filter: any = {};
  @Input() moiQuanTam: string = '';
  @Input() kieuHienThi: string = 'report';
  @Output() totalChanged = new EventEmitter<number>();
  // bán hàng, lợi nhuận
  data: BaoCaoHangHoaBanHang[] = [];
  tongRow!: BaoCaoHangHoaBanHang;
  hasData = true;
  // giá trị kho
  dataGiaTriKho: BaoCaoHangHoaGiaTriKho[] = [];
  tongGiaTriKho!: BaoCaoHangHoaGiaTriKho;
  hasGiaTriKhoData = true;
  // xuất nhập tồn
  xuatNhapTonData: BaoCaoHangHoaXuatNhapTon[] = [];
  tongXuatNhapTon!: BaoCaoHangHoaXuatNhapTon;
  hasXuatNhapTonData = true;
  // Nhà cung cấp
  dataNCC: BaoCaoHangHoaNhaCungCapNhap[] = [];
  tongNCC!: BaoCaoHangHoaNhaCungCapNhap;
  hasNCCData = true;

  constructor(private baoCaoService: BaoCaoHangHoaService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.loadData();
    }
  }

  loadData() {
    console.log('Đang gọi API với moiQuanTam:', this.moiQuanTam);

    const params = {
      ...this.filter,
      moiQuanTam: this.moiQuanTam,
      kieuHienThi: this.kieuHienThi,
      pageNumber: 1,
      pageSize: 10
    };

      const handleError = (err: any) => {
        this.data = [];
        this.dataGiaTriKho = [];
        this.xuatNhapTonData = [];
        this.dataNCC = [];

        this.hasData = false;
        this.hasGiaTriKhoData = false;
        this.hasXuatNhapTonData = false;
        this.hasNCCData = false;

        this.totalChanged.emit(0);
        console.error('Lỗi tải dữ liệu báo cáo:', err);
      };


    if (this.moiQuanTam === 'gia-tri-kho') {
      this.baoCaoService.getGiaTriKho(params).subscribe(res => {
        console.log(' Raw Response:', res); // 👉 Kiểm tra format

        // Gán tách biệt
        const rawData = res.data || [];
        this.dataGiaTriKho = rawData;
        this.tongGiaTriKho = res.tong;
        this.hasGiaTriKhoData = Array.isArray(rawData) && rawData.length > 0;

        this.totalChanged.emit(res.totalItems);
        console.log('dataGiaTriKho:', this.dataGiaTriKho);
        console.log('hasGiaTriKhoData:', this.hasGiaTriKhoData);
      }, handleError);
      return;
    }
    if (this.moiQuanTam === 'xuat-nhap-ton') {
      this.baoCaoService.getXuatNhapTon(params).subscribe(res => {
        this.xuatNhapTonData = res.data || [];
        this.tongXuatNhapTon = res.tong;
        this.hasXuatNhapTonData = this.xuatNhapTonData.length > 0;
        this.totalChanged.emit(res.totalItems);
        console.log('Xuất nhập tồn:', this.xuatNhapTonData);
      }, handleError);
      return;
    }
    if (this.moiQuanTam === 'ncc-theo-hang-nhap') {
      this.baoCaoService.getNCCTheoHangNhap(params).subscribe(res => {
        this.dataNCC = res.data|| [];
        this.tongNCC = res.tong;
        this.hasNCCData = Array.isArray(res.data) && res.data.length > 0;
        this.totalChanged.emit(res.totalItems);
        console.log('Data NCC:', res.data);
        console.log('Tong NCC:', res.tong);
        console.log('Check hasNCCData:', this.hasNCCData);

      }, handleError);
      return;
    }


    // Báo cáo khác
    const handleResponse = (res: {
      data: BaoCaoHangHoaBanHang[],
      tong: BaoCaoHangHoaBanHang,
      totalItems: number
    }) => {
      this.data = res.data || [];
      this.tongRow = res.tong;
      this.hasData = this.data.length > 0;
      this.totalChanged.emit(res.totalItems);
      console.log(' Báo cáo khác:', this.data, 'Tổng:', this.tongRow);
    };

    switch (this.moiQuanTam) {
      case 'loi-nhuan':
        this.baoCaoService.getLoiNhuan(params).subscribe(handleResponse, handleError);
        break;
      default:
        this.baoCaoService.getReportBanHang(params).subscribe(handleResponse, handleError);
        break;
    }
  }
}
