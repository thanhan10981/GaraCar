import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DichVu } from '../../model/model.component';
import { DichVuService } from '../../service/dichvu.service';
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-dichvu',
  standalone: true,
  templateUrl: './dichvu.component.html',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, FooterComponent],
  styleUrls: ['./dichvu.component.css'],
})
export class ServiceComponent implements OnInit {
  searchText: string = '';
  giamin: number | null = null;
  giamax: number | null = null;
  isExporting = false;
  danhSachs: DichVu[] = [];
  danhSach: DichVu = this.resetDichVu();
  isEdit = false;
  showForm = false;
  selectedItems: Set<string> = new Set();
  isAllSelected: boolean = false;

  Success = false;
  toastMessage = '';

  resetDichVu() {
    return {
      MaDichVu: '',
      TenDichVu: '',
      DonGia: '0'
    }
  }

  constructor(private dvService: DichVuService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.dvService.getAll().subscribe({
      next: (data: any[]) => {
        this.danhSachs = data.map(dv => ({
          MaDichVu: dv.MaDichVu,
          TenDichVu: dv.TenDichVu,
          DonGia: dv.DonGia
        }));
        console.log('Dữ liệu dịch vụ:', this.danhSachs);
      },
      error: err => {
        console.error('Lỗi khi lấy danh sách dịch vụ:', err);
        this.toastMessage = '❌ Lỗi khi tải dữ liệu';
        this.Success = false;
        setTimeout(() => {
          this.Success = false;
          this.toastMessage = '';
        }, 3000);
      }
    });
  }

  selectedDV: any = null;
  selectedIndex: number = -1;

  // Xử lý khi click vào checkbox để hiện form cập nhật
  selectDVForEdit(dv: any, i: number) {
    this.selectedDV = dv;
    this.selectedIndex = i;
    this.openModal();
    console.log('Dữ liệu gửi PUT:', this.selectedDV);
  }

  // Xử lý khi click vào hàng để hiện thông tin
  selectDVForDetails(dv: any, i: number) {
    if (this.selectedIndex === i) {
      this.selectedDV = null;
      this.selectedIndex = -1;
    } else {
      this.selectedDV = dv;
      this.selectedIndex = i;
    }
  }

  // Xử lý chọn tất cả
  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    if (this.isAllSelected) {
      this.danhSachs.forEach(dv => this.selectedItems.add(dv.MaDichVu));
    } else {
      this.selectedItems.clear();
    }
  }

  // Xử lý chọn từng item
  toggleSelectItem(maDichVu: string) {
    if (this.selectedItems.has(maDichVu)) {
      this.selectedItems.delete(maDichVu);
    } else {
      this.selectedItems.add(maDichVu);
    }
    this.isAllSelected = this.selectedItems.size === this.danhSachs.length;
  }

  // Xóa nhiều dịch vụ
  deleteMultiple() {
    if (this.selectedItems.size === 0) {
      this.toastMessage = 'Vui lòng chọn ít nhất một dịch vụ để xóa';
      this.Success = false;
      return;
    }

    const promises = Array.from(this.selectedItems).map(maDichVu => 
      this.dvService.delete(maDichVu).toPromise()
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
    if (this.selectedDV) {
      this.showDeleteConfirm = true;
    }
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }

  closeModal() {
    this.showForm = false;
    this.resetDichVu();
  }

  openModal() {
    this.showForm = true;
  }

  deleteDV() {
    if (this.selectedDV) {
      this.dvService.delete(this.selectedDV.MaDichVu).subscribe({
        next: () => {
          this.getAll();
          this.closeDeleteConfirm();
          this.toastMessage = '✅ Xóa thành công';
          this.Success = true;
          setTimeout(() => {
            this.Success = false;
            this.toastMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('❌ Lỗi xóa:', err);
          this.toastMessage = '❌ Lỗi khi xóa';
          this.Success = false;
        }
      });
    }
  }

  updateDV() {
    if (this.selectedDV) {
      if (!this.selectedDV.TenDichVu || !this.selectedDV.DonGia) {
        this.toastMessage = 'Vui lòng nhập đầy đủ thông tin';
        this.Success = false;
        return;
      }

      if (this.selectedDV.DonGia <= 0) {
        this.toastMessage = 'Đơn giá phải lớn hơn 0';
        this.Success = false;
        return;
      }

      this.dvService.update(this.selectedDV.MaDichVu, this.selectedDV).subscribe({
        next: () => {
          this.toastMessage = '✅ Cập nhật thành công';
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
          this.toastMessage = '❌ Cập nhật thất bại';
          this.Success = false;
        }
      });
    }
  }

  locDV() {
    // Tự động xác định loại tìm kiếm và chuyển về chữ thường
    let searchType = 'TenDichVu';
    const searchText = this.searchText.toLowerCase();
    
    if (searchText.startsWith('dv')) {
      searchType = 'MaDichVu';
    }

    this.dvService.filterDichVu(
      searchText,
      searchType,
      '', // MaDichVu
      '', // TenDichVu
      this.giamin,
      this.giamax
    ).subscribe({
      next: (res: DichVu[]) => {
        this.danhSachs = res;
      },
      error: (err) => {
        console.error('❌ Lỗi khi lọc dịch vụ:', err);
      }
    });
  }

  resetFilters() {
    this.searchText = '';
    this.giamin = null;
    this.giamax = null;
    this.getAll();
  }

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  exportExcel() {
    this.isExporting = true;
    this.dvService.exportFile().subscribe({
      next: (res: Blob) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'DanhSachDichVu.xlsx';
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
