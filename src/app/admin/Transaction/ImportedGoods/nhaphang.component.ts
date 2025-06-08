// nhaphang.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { NhapHangService } from '../../service/nhaphang.service';
import { NhapHang, NhapHangUpdate } from '../../model/model.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import e from 'express';
import { FooterComponent } from "../../footer/footer.component";
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-nhaphang',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './nhaphang.component.html',
  styleUrls: ['./nhaphang.component.css']
})


export class NhapHangComponent {

  searchText: string = '';
  tuNgay = '';
  denNgay = '';
  page = 1;
  pageSize = 10;
  isExporting = false;
  danhSachs: NhapHang[] = [];
  danhSachSanPham: any[] = [];
  danhSachNCC: any[] = [];

  danhSach: NhapHang = this.resetNhapHang();
  isEdit = false;
  showForm = false;

  selectedTrangThai: string = '';

  Success = false;
  toastMessage = '';

  selectedItems: Set<string> = new Set();
  isAllSelected: boolean = false;

  resetNhapHang() {
    return {
      MaNhapHang: '',
      MaSanPham: '',
      TenSanPham: '',
      MaNCC: '',
      TenNCC: '',
      SoLuong: '',
      ThoiGianTao: '',
      TrangThai: '',
      TienNhap: '',
      NguoiTao: '',
      TienNo: '',
    }
  }
  constructor(
    private nhapHangService: NhapHangService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getAll();
    this.getSanPhams();
    this.getNhaCungCaps();
  }
  getAll() {
    this.nhapHangService.getAll().subscribe(res => {
      this.danhSachs = res;
    });
  }
  getSanPhams() {
    this.http.get<any[]>('https://localhost:7037/api/SanPhams').subscribe(res => {
      this.danhSachSanPham = res;
    });
  }

  getNhaCungCaps() {
    this.http.get<any[]>('https://localhost:7037/api/NhaCungCaps').subscribe(res => {
      this.danhSachNCC = res;
    });
  }



  getNhapHang() {
    return {
      MaNhapHang: '',
      MaSanPham: '',
      MaNCC: '',
      Soluong: '',
      ThoiGianTao: '',
      TrangThai: '',
      TienNhap: '',
      NguoiTao: '',
      TienNo: '',
    }
  }


  selectedNH: any = null;
  selectedIndex: number = -1;

  selectNH(c: any, i: number) {
    if (this.selectedIndex === i) {
      this.selectedNH = null;
      this.selectedIndex = -1;
    } else {
      this.selectedNH = c;
      this.selectedIndex = i;
      this.openModal();
    }
    console.log('Dữ liệu gửi PUT:', this.selectedNH);

  }


  showConfirmModal: boolean = false;
  openConfirmModal() {
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  showDeleteConfirm: boolean = false;

  // Mở modal xác nhận
  openDeleteConfirmModal() {
    if (this.selectedNH) {
      this.showDeleteConfirm = true;
    }
  }

  // Đóng modal xác nhận
  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }

  closeModal() {
    this.showForm = false;
    this.resetNhapHang();
  }
  openModal() {
    this.showForm = true;
  }
  deleteNH() {
    if (this.selectedNH) {
      this.nhapHangService.delete(this.selectedNH.MaNhapHang).subscribe(() => {
        this.getAll();
        this.closeDeleteConfirm();
      });
    }
  }
  updateNH() {
    if (this.selectedNH) {
      if (!this.selectedNH.MaSanPham || !this.selectedNH.MaNCC) {
        this.toastMessage = 'Thiếu mã sản phẩm hoặc mã nhà cung cấp';
        this.Success = false;
        return;
      }

      const payload: NhapHangUpdate = {
        MaNhapHang: this.selectedNH.MaNhapHang,
        MaSanPham: this.selectedNH.MaSanPham,
        MaNCC: this.selectedNH.MaNCC,
        SoLuong: String(this.selectedNH.SoLuong),
        ThoiGianTao: new Date(this.selectedNH.ThoiGianTao).toISOString(),
        TrangThai: this.selectedNH.TrangThai,
        TienNhap: Number(this.selectedNH.TienNhap),
        TienNo: Number(this.selectedNH.TienNo),
        NguoiTao: this.selectedNH.NguoiTao,
      };

      console.log('✅ Dữ liệu thực tế gửi PUT:', payload);

      this.nhapHangService.update(payload.MaNhapHang, payload).subscribe({
        next: () => {
          this.toastMessage = 'Cập nhật thành công';
          this.Success = true;
          this.getAll();
          this.closeModal();

          setTimeout(() => {
            this.Success = false;
            this.toastMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('❌ Lỗi cập nhật:', err);
          this.toastMessage = 'Cập nhật thất bại';
          this.Success = false;
        }
      });
    }
  }
  locNhapHang() {
    // Chuyển đổi searchText về chữ thường để tìm kiếm không phân biệt hoa thường
    const searchText = this.searchText.toLowerCase();

    const filters = {
      search: searchText || '',
      trangThai: this.selectedTrangThai || '',
      tuNgay: this.tuNgay ? new Date(this.tuNgay).toISOString() : undefined,
      denNgay: this.denNgay ? new Date(this.denNgay).toISOString() : undefined,
      page: this.page,
      pageSize: this.pageSize
    };

    console.log("🔎 Bộ lọc gửi:", filters);

    this.nhapHangService.getFiltered(filters).subscribe({
      next: (res) => {
        this.danhSachs = res.data;
      },
      error: (err) => {
        console.error('❌ Lỗi khi lọc nhập hàng:', err);
      }
    });
  }

  resetFilters() {
    this.searchText = '';
    this.selectedTrangThai = '';
    this.tuNgay = '';
    this.denNgay = '';
    this.page = 1;
    this.pageSize = 10;
    this.locNhapHang();
    this.getAll();
  }
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  exportExcel() {
    this.isExporting = true;
    this.nhapHangService.exportExcel({
      search: this.searchText,
      trangThai: this.selectedTrangThai,
      tuNgay: this.tuNgay ? new Date(this.tuNgay).toISOString() : undefined,
      denNgay: this.denNgay ? new Date(this.denNgay).toISOString() : undefined,
    }).subscribe({
      next: (res) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DanhSachNhapHang.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.isExporting = false;
      },
      error: () => {
        this.toastMessage = '❌ Lỗi khi xuất Excel';
        this.isExporting = false;
      }
    });
  }

  // Xử lý khi click vào checkbox để hiện form cập nhật
  selectNHForEdit(nh: any, i: number) {
    this.selectedNH = nh;
    this.selectedIndex = i;
    this.openModal();
    console.log('Dữ liệu gửi PUT:', this.selectedNH);
  }

  // Xử lý khi click vào hàng để hiện thông tin
  selectNHForDetails(nh: any, i: number) {
    if (this.selectedIndex === i) {
      this.selectedNH = null;
      this.selectedIndex = -1;
    } else {
      this.selectedNH = nh;
      this.selectedIndex = i;
    }
  }

  // Xử lý chọn tất cả
  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    if (this.isAllSelected) {
      this.danhSachs.forEach(nh => this.selectedItems.add(nh.MaNhapHang));
    } else {
      this.selectedItems.clear();
    }
  }

  // Xử lý chọn từng item
  toggleSelectItem(maNhapHang: string) {
    if (this.selectedItems.has(maNhapHang)) {
      this.selectedItems.delete(maNhapHang);
    } else {
      this.selectedItems.add(maNhapHang);
    }
    this.isAllSelected = this.selectedItems.size === this.danhSachs.length;
  }

  // Xóa nhiều nhập hàng
  deleteMultiple() {
    if (this.selectedItems.size === 0) {
      this.toastMessage = 'Vui lòng chọn ít nhất một đơn nhập hàng để xóa';
      this.Success = false;
      return;
    }

    const promises = Array.from(this.selectedItems).map(maNhapHang => 
      this.nhapHangService.delete(maNhapHang).toPromise()
    );

    Promise.all(promises)
      .then(() => {
        this.toastMessage = '✅ Xóa thành công';
        this.Success = true;
        this.selectedItems.clear();
        this.isAllSelected = false;
        this.getAll();
        setTimeout(() => {
          this.Success = false;
          this.toastMessage = '';
        }, 3000);
      })
      .catch(err => {
        console.error('❌ Lỗi xóa:', err);
        this.toastMessage = '❌ Lỗi khi xóa';
        this.Success = false;
      });
  }
}