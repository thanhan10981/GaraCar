import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisplayService } from '../../display.service';
import { BaoCaoNhaCungCapDTO, NhaCungCap } from '../../../model/model.component';
import { BaoCaoHangHoaService } from '../../../service/bao-cao-hang-hoa.service';
import { NhaCungCapService } from '../../../service/nhacungcap.service';

@Component({
  selector: 'app-sidebar-provider',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar-provider.component.html',
  styleUrl: './sidebar-provider.component.css'
})
export class SidebarProviderComponent {
  @Output() filterChanged = new EventEmitter<any>();
  [x: string]: any;
  isVertical: boolean = false;
  interestOptions = [
    { label: 'Nhập hàng', value: 'nhap-hang' },
    { label: 'Công nợ', value: 'cong-no' },
    { label: 'Hàng nhập theo NCC', value: 'hang-nhap-theo-ncc' }
  ];
  selectedInterest: string = 'nhap-hang';

  // Thời gian
  selectedTime: string = 'week';
  selectedLabel: string = 'Tuần này';
  showQuickSelect: boolean = false;
  showDateRange: boolean = false;
  fromDate: string = '';
  toDate: string = '';

  // Nhà cung cấp
  dsNhaCungCap: BaoCaoNhaCungCapDTO[] = [];
  selectedSupplier: string = '';

  kieuHienThi: string = 'report';

   dsNCC:NhaCungCap[]=[];
  selectedNCC: string = '';
    

  constructor(
    private displayService: DisplayService,
    private nccService: BaoCaoHangHoaService,
    private NCCService: NhaCungCapService,
  ) {}

  toggleQuickSelect(event: MouseEvent) {
    event.stopPropagation();
    this.showQuickSelect = !this.showQuickSelect;
  }

  selectQuickRange(type: string) {
    this.selectedLabel = type;
  }

  onTimeChange() {
    this.showDateRange = this.selectedTime === 'custom';
    if (this.selectedTime !== 'week') {
      this.showQuickSelect = false;
    }
  }

  generateReport() {
    this.emitFilter();
  }

  ngOnInit() {
    this.displayService.updateDisplayType(this.kieuHienThi);

    this.nccService.getBaoCaoNhaCungCap({ pageNumber: 1, pageSize: 100 }).subscribe((res) => {
      this.dsNhaCungCap = res.data;
    });
    this.NCCService.getAllNhaCungCap().subscribe(res => {
      this.dsNCC = res;
    });

    this.emitFilter();
  }

  onChange() {
    this.displayService.updateDisplayType(this.kieuHienThi);
  }

  emitFilter() {
    const filter = {
      moiQuanTam: this.selectedInterest,
      thoiGian: this.selectedTime === 'custom' ? 'Lựa chọn khác' : this.selectedLabel,
      tuNgay: this.selectedTime === 'custom' ? this.fromDate : null,
      denNgay: this.selectedTime === 'custom' ? this.toDate : null,
      maNhaCungCap: this.selectedNCC ,
      pageNumber: 1,
      pageSize: 10
    };

    this.filterChanged.emit({
      moiQuanTam: this.selectedInterest,
      kieuHienThi: this.kieuHienThi,
      filter
    });

    console.log('📤 Emit filter:', {
      moiQuanTam: this.selectedInterest,
      kieuHienThi: this.kieuHienThi,
      filter
    });
  }
}
