import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisplayService } from '../../display.service';
import { LoaiHangService } from '../../../service/loaihang.service';
import { LoaiHang, NhaCungCap } from '../../../model/model.component';
import { NhaCungCapService } from '../../../service/nhacungcap.service';

@Component({
  selector: 'app-sidebar-product-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-product-report.component.html',
  styleUrl: './sidebar-product-report.component.css'
})
export class SidebarProductReportComponent {
  @Output() filterChanged = new EventEmitter<any>();

  isVertical: boolean = false;
  kieuHienThi: string = 'chart';
  

  // Mối quan tâm
  interestOptions = [
  { label: 'Bán hàng', value: 'ban-hang' },
  { label: 'Lợi nhuận', value: 'loi-nhuan' },
  { label: 'Giá trị kho', value: 'gia-tri-kho' },
  { label: 'Xuất nhập tồn', value: 'xuat-nhap-ton' },
  { label: 'Xuất nhập tồn chi tiết', value: 'xuat-nhap-ton-chi-tiet' },
  { label: 'NCC theo hàng nhập', value: 'ncc-theo-hang-nhap' },
  { label: 'Sửa chữa', value: 'sua-chua' }
];
selectedInterest: string = 'ban-hang';


  // Thời gian
  selectedTime: string = 'week';
  selectedLabel: string = 'Tuần này';
  showQuickSelect: boolean = false;
  showDateRange: boolean = false;
  fromDate: string = '';
  toDate: string = '';

  // Loại báo cáo
  selectedLoaiBaoCao: string = 'ban-chay'; // Mặc định, nếu cần dropdown thì thêm sau

  // Bộ lọc chung
  filter: any = {};
  dsLoaiHang:LoaiHang[]=[];
  selectedLoaiHang: string = '';
  dsNCC:NhaCungCap[]=[];
  selectedNCC: string = '';
  

  constructor(private displayService: DisplayService, private loaiHangService: LoaiHangService, private nccService: NhaCungCapService) {}

  ngOnInit() {
    this.displayService.updateDisplayType(this.kieuHienThi);
    this.loaiHangService.getAllLoaiHang().subscribe(res => {
      this.dsLoaiHang = res;
    });
    this.nccService.getAllNhaCungCap().subscribe(res => {
      this.dsNCC = res;
    });
    this.emitFilter(); // Gửi dữ liệu mặc định ban đầu
  }

  onChange() {
    this.displayService.updateDisplayType(this.kieuHienThi);
    this.emitFilter();
  }

  onTimeChange() {
    this.showDateRange = this.selectedTime === 'custom';
    if (this.selectedTime !== 'week') {
      this.showQuickSelect = false;
    }
    this.emitFilter(); 
  }

  toggleQuickSelect(event: MouseEvent) {
    event.stopPropagation(); // Ngăn click gây mất focus radio
    this.showQuickSelect = !this.showQuickSelect;
  }

  selectQuickRange(type: string) {
   
    this.selectedLabel = type;
    this.filter.thoiGian = type;
    this.emitFilter();
  }
  // gán những biến cố định dưới rồi gọi emit để thực hiện chức năng của emit cùng với các biến này
  generateReport() {
  this.filter = {
    ...this.filter,
    tuNgay: this.fromDate,
    denNgay: this.toDate,
    thoiGian: 'Lựa chọn khác' 
  };

  this.emitFilter();
}
 isHiddenInterest(value: string): boolean {
  const hideWhenReport = ['xuat-nhap-ton-chi-tiet', 'sua-chua'];
  return this.kieuHienThi === 'report' && hideWhenReport.includes(value);
}

  // tổng hợp đk lọc gửi ra ngoài qua @Output() để page nhận dc
  // luôn chạy khi có thay đổi tại các biến lọc này không cố định
  emitFilter() {
  this.filter.maLoaiHang = this.selectedLoaiHang;
  this.filter.maNhaCungCap = this.selectedNCC;

  if (this.selectedTime === 'custom') {
  if (!this.fromDate || !this.toDate) {
    console.warn('Chưa chọn đủ ngày!');
    return;
  }
  this.filter.tuNgay = this.fromDate;
  this.filter.denNgay = this.toDate;
  }
  else {
    this.filter.thoiGian = this.selectedLabel;
  }

  this.filterChanged.emit({
    
    moiQuanTam: this.selectedInterest,
    kieuHienThi: this.kieuHienThi,
    filter: this.filter
  });

  console.log('📤 Emit filter:', {
    moiQuanTam: this.selectedInterest,
    kieuHienThi: this.kieuHienThi,
    filter: this.filter
  });
}


}
