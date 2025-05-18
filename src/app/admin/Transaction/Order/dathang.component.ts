import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HoaDon } from '../../model/model.component';
import { HoaDonService } from '../../service/hoadon.service';

@Component({
  selector: 'app-dathang',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './dathang.component.html',
  styleUrls: ['./dathang.component.css']
})
export class OrderComponent implements OnInit {
  danhSach: HoaDon[] = [];
  danhSachGoc: HoaDon[] = [];

  selectedTrangThai: string = '';
  searchText: string = '';

  showForm: boolean = false;
  isEdit: boolean = false;
  hoaDon: HoaDon = this.resetHoaDon();

  constructor(private hoaDonService: HoaDonService) {}

selectedStatus: string = '';
startDate: string = '';
endDate: string = '';



filterByStatus() {
  // lọc theo selectedStatus
}

filterByDate() {
  // lọc theo startDate và endDate
}

resetFilter() {
  this.searchText = '';
  this.selectedStatus = '';
  this.startDate = '';
  this.endDate = '';
  this.search(); // gọi lại search hoặc fetchAll()
}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.hoaDonService.getAll().subscribe(data => {
      this.danhSach = data;
      this.danhSachGoc = [...data];
    });
  }

  resetHoaDon(): HoaDon {
    return {
      maHoaDon: '',
      maSanPham: '',
      maKhachHang: '',
      soLuong: 1,
      thoiGian: new Date(),
      ngayGiaoDuKien: new Date(),
      nguoiBan: '',
      trangThai: '',
      ghiChu: '',
      tongTien: 0
    };
  }

  showAddForm() {
    this.isEdit = false;
    this.hoaDon = this.resetHoaDon();
    this.showForm = true;
  }

  edit(hd: HoaDon) {
    this.isEdit = true;
    this.hoaDon = { ...hd };
    this.showForm = true;
  }

  huy() {
    this.showForm = false;
    this.hoaDon = this.resetHoaDon();
  }

  submitForm() {
    if (this.isEdit) {
      this.hoaDonService.update(this.hoaDon.maHoaDon, this.hoaDon).subscribe(() => {
        this.loadData();
        this.huy();
      });
    } else {
      this.hoaDonService.add(this.hoaDon).subscribe(() => {
        this.loadData();
        this.huy();
      });
    }
  }

  xoa(maHoaDon: string) {
    if (confirm('Bạn có chắc muốn xoá hóa đơn này không?')) {
      this.hoaDonService.delete(maHoaDon).subscribe(() => {
        this.loadData();
      });
    }
  }

  filterByTrangThai() {
    if (!this.selectedTrangThai) {
      this.danhSach = [...this.danhSachGoc];
    } else {
      this.danhSach = this.danhSachGoc.filter(h => h.trangThai === this.selectedTrangThai);
    }
  }

  search() {
    const keyword = this.searchText.toLowerCase();
    this.danhSach = this.danhSachGoc.filter(h =>
      h.maHoaDon.toLowerCase().includes(keyword)
    );
  }
}
