import { Component, OnInit } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HoaDon } from '../../model/model.component';
import { HoaDonService } from '../../service/hoadon.service';

@Component({
  selector: 'app-hoadon',
  standalone: true,
  templateUrl: './hoadon.component.html',
  styleUrls: ['./hoadon.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BillComponent implements OnInit {
  danhSach: HoaDon[] = [];
  hoadon: HoaDon = this.resetData();
  isEdit = false;

  constructor(private hdService: HoaDonService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.hdService.getAll().subscribe(ds => this.danhSach = ds);
  }

  submitForm() {
    if (this.isEdit) {
      this.hdService.update(this.hoadon.maHoaDon, this.hoadon).subscribe(() => {
        this.loadData();
        this.resetForm();
      });
    } else {
      this.hdService.add(this.hoadon).subscribe(() => {
        this.loadData();
        this.resetForm();
      });
    }
  }

  edit(hd: HoaDon) {
    this.hoadon = { ...hd };
    this.isEdit = true;
  }

  delete(ma: string) {
    if (confirm('Xác nhận xóa hóa đơn?')) {
      this.hdService.delete(ma).subscribe(() => this.loadData());
    }
  }

  cancel() {
    this.resetForm();
  }

  resetForm() {
    this.hoadon = this.resetData();
    this.isEdit = false;
  }

  resetData(): HoaDon {
    return {
      maHoaDon: '',
      maSanPham: '',
      maKhachHang: '',
      soLuong: 0,
      thoiGian: new Date(),
      ngayGiaoDuKien: new Date(),
      nguoiBan: '',
      trangThai: '',
      ghiChu: '',
      tongTien: 0
    };
  }
}
