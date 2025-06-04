import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { BaoCaoHangHoaService } from '../../../service/bao-cao-hang-hoa.service';
import { BaoCaoNhaCungCapDTO } from '../../../model/model.component';

@Component({
  selector: 'app-table-provider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-provider.component.html',
  styleUrl: './table-provider.component.css'
})
export class TableProviderComponent implements OnInit {
  @Input() filter!: any;
  @Input() moiQuanTam!: string;
  @Output() totalChanged = new EventEmitter<number>();


  hasData = true;

  data: BaoCaoNhaCungCapDTO[] = [];
  chiTiet: any[] = []; // nếu cần show chi tiết giao dịch

  constructor(private baoCaoService: BaoCaoHangHoaService) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges() {
    this.loadData();
  }

  loadData() {
    if (!this.filter) return;
    this.baoCaoService.getBaoCaoNhaCungCap(this.filter).subscribe(res => {
      this.data = res.data;
      this.hasData = res.data && res.data.length > 0;
      this.totalChanged.emit(res.totalItems);
    });
  }


}
