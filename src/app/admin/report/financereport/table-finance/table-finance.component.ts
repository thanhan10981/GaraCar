import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaocaotaichinhService } from '../../../service/baocaotaichinh.service';

@Component({
  selector: 'app-table-finance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-finance.component.html',
  styleUrl: './table-finance.component.css'
})
export class TableFinanceComponent implements OnInit {
   @Input() fromDate!: string;
  @Input() toDate!: string;
@Input() thoiGian: string = '';

  data: any = {};

  constructor(private baoCaoService: BaocaotaichinhService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromDate'] || changes['toDate']) {
      this.loadData();
    }
  }

  loadData() {
  const params: any = {};
  if (this.fromDate) params.tuNgay = this.fromDate;
  if (this.toDate) params.denNgay = this.toDate;
  if (this.thoiGian) params.thoiGian = this.thoiGian;

  this.baoCaoService.getBaoCaoTaiChinh(params).subscribe(res => {
    this.data = res;
  });
}

}
