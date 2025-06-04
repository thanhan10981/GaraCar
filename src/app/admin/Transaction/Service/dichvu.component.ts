import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DichVu } from '../../model/model.component';
import { DichVuService } from '../../service/dichvu.service';

@Component({
  selector: 'app-dichvu',
  standalone: true,
  templateUrl: './dichvu.component.html',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  styleUrls: ['./dichvu.component.css'],
})
export class ServiceComponent implements OnInit {
  danhSach: DichVu[] = [];
  danhSachGoc: DichVu[] = [];
  dichVu: DichVu = { maDichVu: '', tenDichVu: '', donGia: 0 };
  isEdit = false;
  showForm = false;
  errorMessage: string = '';

  // Biến cho tìm kiếm và lọc
  searchText: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private dvService: DichVuService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.dvService.getAll().subscribe({
      next: (data) => {
        this.danhSach = data;
        this.danhSachGoc = [...data];
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.errorMessage = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
      }
    });
  }

  // Hàm tìm kiếm
  search() {
    if (!this.searchText && !this.minPrice && !this.maxPrice) {
      this.danhSach = [...this.danhSachGoc];
      return;
    }

    this.danhSach = this.danhSachGoc.filter(dv => {
      const matchSearch = !this.searchText || 
        dv.tenDichVu.toLowerCase().includes(this.searchText.toLowerCase()) ||
        dv.maDichVu.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchPrice = (!this.minPrice || dv.donGia >= this.minPrice) &&
                        (!this.maxPrice || dv.donGia <= this.maxPrice);

      return matchSearch && matchPrice;
    });
  }

  // Hàm lọc theo giá
  filterByPrice() {
    this.search();
  }

  // Reset bộ lọc
  resetFilter() {
    this.searchText = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.danhSach = [...this.danhSachGoc];
  }

  submitForm() {
    if (!this.dichVu.tenDichVu || !this.dichVu.donGia) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin dịch vụ.';
      return;
    }

    if (this.isEdit) {
      this.dvService.update(this.dichVu.maDichVu, this.dichVu).subscribe({
        next: () => {
          this.loadData();
          this.resetForm();
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error updating service:', error);
          this.errorMessage = 'Không thể cập nhật dịch vụ. Vui lòng thử lại sau.';
        }
      });
    } else {
      this.dvService.add(this.dichVu).subscribe({
        next: () => {
          this.loadData();
          this.resetForm();
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error adding service:', error);
          this.errorMessage = 'Không thể thêm dịch vụ. Vui lòng thử lại sau.';
        }
      });
    }
  }

  edit(dv: DichVu) {
    this.dichVu = { ...dv };
    this.isEdit = true;
    this.showForm = true;
    this.errorMessage = '';
  }

  xoa(ma: string) {
    if (confirm('Bạn có chắc chắn xoá?')) {
      this.dvService.delete(ma).subscribe({
        next: () => {
          this.loadData();
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error deleting service:', error);
          this.errorMessage = 'Không thể xóa dịch vụ. Vui lòng thử lại sau.';
        }
      });
    }
  }  

  huy() {
    this.resetForm();
  }

  resetForm() {
    this.dichVu = { maDichVu: '', tenDichVu: '', donGia: 0 };
    this.isEdit = false;
    this.showForm = false;
    this.errorMessage = '';
  }

  showAddForm() {
    this.resetForm();
    this.showForm = true;
  }
}
