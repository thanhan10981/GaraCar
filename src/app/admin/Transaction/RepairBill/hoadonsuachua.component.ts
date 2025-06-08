import { Component, OnInit } from '@angular/core';
import { HoaDonSuaChuaUpdate, HoaDonSuaChua } from '../../model/model.component';
import { HoaDonSuaChuaService } from '../../service/hoadonsuachua.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../../footer/footer.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hoadon-sua-chua',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './hoadonsuachua.component.html',
  styleUrls: ['./hoadonsuachua.component.css']
})
export class HoaDonSuaChuaComponent {
  searchText: string = '';
  tuNgay = '';
  denNgay = '';
  page = 1;
  pageSize = 10;
  isExporting = false;
  danhSachs: HoaDonSuaChua[] = [];
  danhSach: HoaDonSuaChua = this.resetHoaDonSC();
  isEdit = false;
  showForm = false;
  danhSachNhanVien: any[] = [];
  danhSachYeuCau: any[] = [];
  selectedTrangThai: string = '';

  Success = false;
  toastMessage = '';

  selectedItems: Set<string> = new Set();
  isAllSelected: boolean = false;

  resetHoaDonSC() {
    return {
      MaHoaDon: '',
      MaYeuCau: '',
      MaNhanVien: '',
      NgayLap: '',
      ThoiGianHoanThanhDuKien: '',
      TrangThai: '',
      TongTien: 0,
      PhuongThucThanhToan: '',
      TenNhanVien: '',
      TenYeuCau: '',
    }
  }
  constructor(
    private hoaDonSuaChuaService: HoaDonSuaChuaService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getAll();
    this.getNhanViens();
    this.getYeuCaus();
  }
  getAll() {
    this.hoaDonSuaChuaService.getAll().subscribe(res => {
      this.danhSachs = res as HoaDonSuaChua[];
      console.log('Dữ liệu hóa đơn sửa chữa:', this.danhSachs);
    }, err => {
      console.error('Lỗi khi lấy danh sách hóa đơn sửa chữa:', err);
      this.toastMessage = '❌ Lỗi khi tải dữ liệu';
      this.Success = false;
      setTimeout(() => {
        this.Success = false;
        this.toastMessage = '';
      }, 3000);
    });
  }
  getYeuCaus() {
    this.http.get<any[]>('https://localhost:7037/api/YeuCauSuaChuas').subscribe(res => {
      this.danhSachYeuCau = res;
    });
  }
  getNhanViens() {
    this.http.get<any[]>('https://localhost:7037/api/NhanViens').subscribe(res => {
      this.danhSachNhanVien = res;
    });
  }

  selectedHDSC: any = null;
  selectedIndex: number = -1;

  selectHDSCForEdit(hdsc: any, i: number) {
    this.selectedHDSC = hdsc;
    this.selectedIndex = i;
    this.openModal();
    console.log('Dữ liệu gửi PUT:', this.selectedHDSC);
  }

  selectHDSCForDetails(hdsc: any, i: number) {
    if (this.selectedIndex === i) {
      this.selectedHDSC = null;
      this.selectedIndex = -1;
    } else {
      this.selectedHDSC = hdsc;
      this.selectedIndex = i;
    }
  }

  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    if (this.isAllSelected) {
      this.danhSachs.forEach(hdsc => this.selectedItems.add(hdsc.MaHoaDon));
    } else {
      this.selectedItems.clear();
    }
  }

  toggleSelectItem(maHoaDon: string) {
    if (this.selectedItems.has(maHoaDon)) {
      this.selectedItems.delete(maHoaDon);
    } else {
      this.selectedItems.add(maHoaDon);
    }
    this.isAllSelected = this.selectedItems.size === this.danhSachs.length;
  }

  deleteMultiple() {
    if (this.selectedItems.size === 0) {
      this.toastMessage = 'Vui lòng chọn ít nhất một hóa đơn để xóa';
      this.Success = false;
      return;
    }

    const promises = Array.from(this.selectedItems).map(maHoaDon => 
      this.hoaDonSuaChuaService.delete(maHoaDon).toPromise()
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

  showConfirmModal: boolean = false;
  openConfirmModal() {
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  showDeleteConfirm: boolean = false;

  openDeleteConfirmModal() {
    if (this.selectedHDSC) {
      this.showDeleteConfirm = true;
    }
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }

  closeModal() {
    this.showForm = false;
    this.resetHoaDonSC();
  }
  openModal() {
    this.showForm = true;
  }
  deleteHDSC() {
    if (this.selectedHDSC) {
      this.hoaDonSuaChuaService.delete(this.selectedHDSC.MaHoaDon).subscribe(() => {
        this.getAll();
        this.closeDeleteConfirm();
      });
    }
  }
  updateHDSC() {
    if (this.selectedHDSC) {
      if (!this.selectedHDSC.MaYeuCau || !this.selectedHDSC.MaNhanVien) {
        this.toastMessage = 'Thiếu mã sản phẩm hoặc mã nhà cung cấp';
        this.Success = false;
        return;
      }

      const payload: HoaDonSuaChuaUpdate = {
  MaHoaDon: this.selectedHDSC.MaHoaDon,
  MaYeuCau: this.selectedHDSC.MaYeuCau,
  MaNhanVien: this.selectedHDSC.MaNhanVien,
  NgayLap: this.selectedHDSC.NgayLap,
  ThoiGianHoanThanhDuKien: this.selectedHDSC.ThoiGianHoanThanhDuKien,
  TrangThai: this.selectedHDSC.TrangThai,
  TongTien: Number(this.selectedHDSC.TongTien),     // ✅ Ép kiểu rõ ràng
  PhuongThucThanhToan: this.selectedHDSC.PhuongThucThanhToan
};


      console.log('✅ Dữ liệu thực tế gửi PUT:', payload);

      this.hoaDonSuaChuaService.update(payload.MaHoaDon, payload).subscribe({
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
  locHDSC() {
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

    this.hoaDonSuaChuaService.filterHoaDonSuaChua(filters).subscribe({
      next: (res: any) => {
        this.danhSachs = res.data as HoaDonSuaChua[];
      },
      error: (err) => {
        console.error('❌ Lỗi khi lọc hóa đơn sửa chữa:', err);
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
    this.locHDSC();
    this.getAll();
  }
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  exportExcel() {
    this.isExporting = true;
    this.hoaDonSuaChuaService.exportExcel({
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
        a.download = 'DanhSachHoaDonSuaChua.xlsx';
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
}
