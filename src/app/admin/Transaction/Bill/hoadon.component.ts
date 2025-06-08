import { Component, OnInit } from '@angular/core';
import { HoaDon, HoaDonUpdate} from '../../model/model.component';
import { HoaDonService } from '../../service/hoadon.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-hoadon',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './hoadon.component.html',
  styleUrls: ['./hoadon.component.css']
})
export class HoaDonComponent  {
  searchText: string = '';
  tuNgay = '';
  denNgay = '';
  page = 1;
  pageSize = 10;
  isExporting = false;
  danhSachs: HoaDon[] = [];
  danhSach: HoaDon = this.resetHoaDon();
  isEdit = false;
  showForm = false;
  danhSachNhanVien: any[] = [];
  danhSachKhachHang: any[] = [];
  selectedTrangThai: string = '';

  Success = false;
  toastMessage = '';

  selectedItems: Set<string> = new Set();
  isAllSelected: boolean = false;

  resetHoaDon() {
    return {
      MaHoaDon: '',
      MaKhachHang: '',
      TenKhachHang: '',
      MaNhanVien: '',
      TenNhanVien: '',
      ThoiGian: '',
      NgayGiaoDuKien: '',
      NguoiBan: '',
      TrangThai: '',
      GhiChu: '',
      PhuThu: '',
      KieuBanHang: '',
      PhuongThucThanhToan: '',
      TongTien: ''
    }
  }
  constructor(
    private hoaDonService: HoaDonService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getAll();
    this.getKhachHangs();
    this.getNhanViens();
  }
  getAll() {
    this.hoaDonService.getAll().subscribe(res => {
      this.danhSachs = res as HoaDon[];
      console.log('Dữ liệu hóa đơn:', this.danhSachs);
    }, err => {
      console.error('Lỗi khi lấy danh sách hóa đơn:', err);
      this.toastMessage = '❌ Lỗi khi tải dữ liệu';
      this.Success = false;
      setTimeout(() => {
        this.Success = false;
        this.toastMessage = '';
      }, 3000);
    });
  }
  getKhachHangs() {
    this.http.get<any[]>('https://localhost:7037/api/KhachHangs').subscribe(res => {
      this.danhSachKhachHang = res;
    });
  }
  getNhanViens() {
    this.http.get<any[]>('https://localhost:7037/api/NhanViens').subscribe(res => {
      this.danhSachNhanVien = res;
    });
  }

  selectedHD: any = null;
  selectedIndex: number = -1;

  selectHDForEdit(hd: any, i: number) {
    this.selectedHD = hd;
    this.selectedIndex = i;
    this.openModal();
    console.log('Dữ liệu gửi PUT:', this.selectedHD);
  }

  selectHDForDetails(hd: any, i: number) {
    if (this.selectedIndex === i) {
      this.selectedHD = null;
      this.selectedIndex = -1;
    } else {
      this.selectedHD = hd;
      this.selectedIndex = i;
    }
  }

  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    if (this.isAllSelected) {
      this.danhSachs.forEach(hd => this.selectedItems.add(hd.MaHoaDon));
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
      this.hoaDonService.delete(maHoaDon).toPromise()
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
    if (this.selectedHD) {
      this.showDeleteConfirm = true;
    }
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }

  closeModal() {
    this.showForm = false;
    this.resetHoaDon();
  }
  openModal() {
    this.showForm = true;
  }
  deleteHD() {
    if (this.selectedHD) {
      this.hoaDonService.delete(this.selectedHD.MaHoaDon).subscribe(() => {
        this.getAll();
        this.closeDeleteConfirm();
      });
    }
  }
  updateHD() {
    if (this.selectedHD) {
      if (!this.selectedHD.MaKhachHang || !this.selectedHD.MaNhanVien) {
        this.toastMessage = 'Thiếu thông tin khách hàng hoặc nhân viên';
        this.Success = false;
        return;
      }

      const payload: HoaDonUpdate = {
        MaHoaDon: this.selectedHD.MaHoaDon,
        MaKhachHang: this.selectedHD.MaKhachHang,
        MaNhanVien: this.selectedHD.MaNhanVien,
        ThoiGian: this.selectedHD.ThoiGian,
        NgayGiaoDuKien: this.selectedHD.NgayGiaoDuKien,
        NguoiBan: this.selectedHD.NguoiBan,
        TrangThai: this.selectedHD.TrangThai,
        GhiChu: this.selectedHD.GhiChu,
        PhuThu: this.selectedHD.PhuThu,
        KieuBanHang: this.selectedHD.KieuBanHang,
        PhuongThucThanhToan: this.selectedHD.PhuongThucThanhToan,
        TongTien: this.selectedHD.TongTien
      };

      console.log('✅ Dữ liệu thực tế gửi PUT:', payload);

      this.hoaDonService.update(payload.MaHoaDon, payload).subscribe({
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
  locHD() {
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

    this.hoaDonService.getFilteredHoaDons(filters).subscribe({
      next: (res: any) => {
        this.danhSachs = res.data as HoaDon[];
      },
      error: (err) => {
        console.error('❌ Lỗi khi lọc hóa đơn:', err);
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
    this.locHD();
    this.getAll();
  }
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  exportExcel() {
    this.isExporting = true;
    this.hoaDonService.exportExcel({
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
        a.download = 'HoaDon.xlsx';
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
