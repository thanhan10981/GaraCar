import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { YeuCauSuaChua } from '../../model/model.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../../footer/footer.component";
import { YeuCauSuaChuaService } from '../../service/yeucausuachua.service';

@Component({
  selector: 'app-yeucausuachua',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './yeucausuachua.component.html',
  styleUrl: './yeucausuachua.component.css'
})

export class RepairRequestComponent  {
  searchText: string = '';
  tuNgay = '';
  denNgay = '';
  page = 1;
  pageSize = 10;
  isExporting = false;
  danhSachs: YeuCauSuaChua[] = [];
  danhSach: YeuCauSuaChua = this.resetYeuCauSuaChua();
  isEdit = false;
  showForm = false;
  danhSachKhachHang: any[] = [];
  selectedTrangThai: string = '';

  Success = false;
  toastMessage = '';

  selectedItems: Set<string> = new Set();
  isAllSelected: boolean = false;

  resetYeuCauSuaChua() {
    return {
      MaYeuCau: '',
      BienSoXe: '',
      NgayDat: new Date(),
      ThoiGianTao: new Date(),
      MoTa: '',
      TrangThai: '',
    }
  }
  constructor(
    private yeuCauSuaChuaService: YeuCauSuaChuaService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.yeuCauSuaChuaService.getAllYeuCauSuaChua().subscribe(res => {
      this.danhSachs = res as YeuCauSuaChua[];
      console.log('Dữ liệu yêu cầu sửa chữa:', this.danhSachs);
    }, err => {
      console.error('Lỗi khi lấy danh sách yêu cầu sửa chữa:', err);
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
  getYeuCauSuaChua() {
    return {
      MaYeuCau: '',
      BienSoXe: '',
      NgayDat: new Date(),
      ThoiGianTao: new Date(),
      MoTa: '',
      TrangThai: '',
    }
  }

  selectedYCSC: any = null;
  selectedIndex: number = -1;

  selectYCSCForEdit(ycsc: any, i: number) {
    this.selectedYCSC = ycsc;
    this.selectedIndex = i;
    this.openModal();
    console.log('Dữ liệu gửi PUT:', this.selectedYCSC);
  }

  selectYCSCForDetails(ycsc: any, i: number) {
    if (this.selectedIndex === i) {
      this.selectedYCSC = null;
      this.selectedIndex = -1;
    } else {
      this.selectedYCSC = ycsc;
      this.selectedIndex = i;
    }
  }

  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    if (this.isAllSelected) {
      this.danhSachs.forEach(ycsc => this.selectedItems.add(ycsc.MaYeuCau));
    } else {
      this.selectedItems.clear();
    }
  }

  toggleSelectItem(maYeuCau: string) {
    if (this.selectedItems.has(maYeuCau)) {
      this.selectedItems.delete(maYeuCau);
    } else {
      this.selectedItems.add(maYeuCau);
    }
    this.isAllSelected = this.selectedItems.size === this.danhSachs.length;
  }

  deleteMultiple() {
    if (this.selectedItems.size === 0) {
      this.toastMessage = 'Vui lòng chọn ít nhất một yêu cầu sửa chữa để xóa';
      this.Success = false;
      return;
    }

    const promises = Array.from(this.selectedItems).map(maYeuCau => 
      this.yeuCauSuaChuaService.deleteYeuCauSuaChua(maYeuCau).toPromise()
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
    if (this.selectedYCSC) {
      this.showDeleteConfirm = true;
    }
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }

  closeModal() {
    this.showForm = false;
    this.resetYeuCauSuaChua();
  }
  openModal() {
    this.showForm = true;
  }
  deleteYCSC() {
    if (this.selectedYCSC) {
      this.yeuCauSuaChuaService.deleteYeuCauSuaChua(this.selectedYCSC.MaYeuCau).subscribe(() => {
        this.getAll();
        this.closeDeleteConfirm();
      });
    }
  }
  updateYCSC() {
    if (this.selectedYCSC) {
      if (!this.selectedYCSC.MaYeuCau) {
        this.toastMessage = 'Thiếu mã yêu cầu';
        this.Success = false;
        return;
      }

      const payload: YeuCauSuaChua = {
        MaYeuCau: this.selectedYCSC.MaYeuCau,
        BienSoXe: this.selectedYCSC.BienSoXe,
        NgayDat: this.selectedYCSC.NgayDat,
        ThoiGianTao: this.selectedYCSC.ThoiGianTao,
        MoTa: this.selectedYCSC.MoTa,
        TrangThai: this.selectedYCSC.TrangThai
      };

      console.log('✅ Dữ liệu thực tế gửi PUT:', payload);

      this.yeuCauSuaChuaService.updateYeuCauSuaChua(payload.MaYeuCau, payload).subscribe({
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
        error: (err: any) => {
          console.error('❌ Lỗi cập nhật:', err);
          this.toastMessage = 'Cập nhật thất bại';
          this.Success = false;
        }
      });
    }
  }
  locYCSC() {
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

    this.yeuCauSuaChuaService.getFilteredYeuCauSuaChua(
      filters.search,
      filters.trangThai,
      filters.tuNgay ? new Date(filters.tuNgay) : undefined,
      filters.denNgay ? new Date(filters.denNgay) : undefined,
      filters.page,
      filters.pageSize
    ).subscribe({
      next: (res: YeuCauSuaChua[]) => {
        this.danhSachs = res;
      },
      error: (err: any) => {
        console.error('❌ Lỗi khi lọc yêu cầu sửa chữa:', err);
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
    this.locYCSC();
    this.getAll();
  }
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  exportExcel() {
    this.isExporting = true;
    this.yeuCauSuaChuaService.exportYeuCauToExcel().subscribe({
      next: (res: Blob) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DanhSachYeuCauSuaChua.xlsx';
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