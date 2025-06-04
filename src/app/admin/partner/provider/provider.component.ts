import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from "../../footer/footer.component";
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NhaCungCap, NhapHang } from '../../model/model.component';
import { ProviderService } from '../../service/provider.service';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-provider',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent,MatDatepickerModule],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.css'
})
export class ProviderComponent {
  tab: string = 'info';
  Providers :NhaCungCap[] = [];
  Provider :NhaCungCap = this.getEmptyProvider();

  constructor(private cdr: ChangeDetectorRef, private providerService:ProviderService){}

  selectedOption = 'code';
  selectedOptionLabel = 'Theo mã, tên, điện thoại';
  searchKeyword = '';
  showDropdown = false;
  showForm = false;
  isOpen = true; // hoặc false nếu muốn ẩn mặc định
  fromAmount?: number;
  toAmount?: number;
  selectedTime: string = 'all';
  FromDate?: string;
  ToDate?: string;
  userRole= JSON.parse(localStorage.getItem('user') || '{}').ChucVu || '';
  userCode= JSON.parse(localStorage.getItem('user') || '{}').MaNhanVien || '';
  userName = JSON.parse(localStorage.getItem('user') || '{}').TenNhanVien || '';
  ngOnInit(): void {
  this.getAllProvider();
   }
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
  getAllProvider(): void {

    this.providerService.getAll().subscribe(
      (data) => {
        this.Providers = data;
        this.getProviders();
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách nhà cung cấp:', error);
      }
    );
    this.providerService.getNhomNCCs().subscribe({
    next: res => this.nhomNCCs = res,
    error: err => console.error('Lỗi lấy danh sách nhóm NCC:', err)
  });

  }
 
private getEmptyProvider(): NhaCungCap {
  return { 
  MaNCC: '',
  TenNCC: '',  
  SDT: '',    
  DiaChi: '',        
  phuongXa: '',      
  Email: '' ,         
  CongTy: '',        
  MaSoThue: '',      
  NhomNCC: '', 
  TongTien:'',
  NgayTao:'',
  NguoiTao:'',  
  TrangThai:'',     
  GhiChu: '', 
  HinhAnh: '',  
  };
}
 showAddModal = false;
showAddSuccess = false;
selectedImageFile: File | null = null;

openModalAdd() {
  debugger
  this.providerService.getAll().subscribe((providers: any[]) => {
    const existingCodes = providers.map(p => p.MaNCC);
    this.Provider.MaNCC = this.generateNextMaNCC(existingCodes);
    this.selectedImageFile = null;
    this.customerImageUrl = '';
    this.showAddModal = true;
  });
}

generateNextMaNCC(maList: string[]): string {
  const numbers = maList
    .filter(ma => /^NCC\d+$/.test(ma))
    .map(ma => parseInt(ma.replace('NCC', ''), 10));

  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  const next = max + 1;

  console.log('✅ Số lớn nhất:', max, '→ Mã mới:', 'NCC' + next.toString().padStart(3, '0'));

  return 'NCC' + next.toString().padStart(3, '0');
}


closeModalAdd() {
  this.showAddModal = false;
}


 openModalUpdate() {
  this.showForm = true;
}
showSuccess = false;
confirmUpdate(form: NgForm): void {
  debugger
  if (form.invalid) return;

  const formData = new FormData();
  const values = form.value;

  // Dữ liệu từ form
  formData.append('TenNCC', values.TenNCC || '');
  formData.append('SDT', values.SDT || '');
  formData.append('NhomNCC', values.NhomNCC || '');
  formData.append('DiaChi', values.DiaChi || '');
  formData.append('PhuongXa', values.PhuongXa || '');
  formData.append('CongTy', values.CongTy || '');
  formData.append('MaSoThue', values.MaSoThue || '');
  formData.append('Email', values.Email || '');
  formData.append('TrangThai', values.TrangThai || '');
  formData.append('TongTien', values.TongTien || '');
  formData.append('NguoiTao', values.NguoiTao || '');
  formData.append('GhiChu', values.GhiChu || '');

  // Ảnh nếu có chọn
  if (this.selectedImageFile) {
    formData.append('HinhAnh', this.selectedImageFile);
  }

  // Gọi API cập nhật
  this.providerService.update(this.selectedProvider.MaNCC, formData).subscribe({
    next: () => {
      this.toastMessage = 'Thông tin khách hàng được cập nhật thành công';
      this.showDeleteSuccess = true;
      setTimeout(() => this.showDeleteSuccess = false, 3000);
      this.closeModal();
      this.getAllProvider();
      this.Providers = [];  
      this.customerImageUrl = null;
      this.selectedIndex = -1;
    },
    error: err => {
    console.error('Lỗi update:', err.message, err.error);

    }
  });
}




save() {
  const formData = new FormData();

  Object.entries(this.Provider).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (this.selectedImageFile) {
    formData.append('HinhAnh', this.selectedImageFile, this.selectedImageFile.name);
  }

  this.providerService.update(this.Provider.MaNCC, formData).subscribe({
    next: () => {
      this.showForm = false;
      this.getAllProvider(); // Load lại danh sách
    },
    error: err => {
      console.error('Lỗi cập nhật:', err);
    }
  });
}
selectImage(): void {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  fileInput?.click();
}



onImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedImageFile = file; // ✅ Lưu file lại để gửi lên API

    // Preview ảnh (dùng base64 cho img)
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedProvider.HinhAnh = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
addImageUrl: string = '';
addImageFile: File | null = null;

@ViewChild('imageInput') addImageInput!: ElementRef;

selectAddImage(): void {
  const file = document.querySelector('input[type="file"]') as HTMLInputElement;
  file?.click();
}
onAddImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.addImageFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.addImageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}


  openModal(){
    this.showForm = true;
  }
  closeModal() {
    this.showForm = false;
  }
  customerImageUrl: string | ArrayBuffer | null = null;



  
  selectOption(option: any) {
    this.selectedOption = option.value;
    this.selectedOptionLabel = option.label;
    this.showDropdown = false;
  }


  isVertical: boolean = false;
  selectedInterest: string = 'Bán hàng';
  interestOptions: string[] = ['Bán hàng', 'Thu chi', 'Hàng hóa', 'Tổng hợp'];
  todayLabel = this.getTodayLabel();
  fromTime = '';
  toTime = '';



  onDateSelected(event: any) {
    const date = event.value;
    if (date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      this.todayLabel = `${day}/${month}/${year}`;
    }
  }
  

  getTodayLabel(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }
  selectedDay: string = '';
  showDateRange: boolean = false;
  


  onTimeChange() {
    if (this.selectedDay === 'custom') {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
    }
  }


  selectedProvider: any = null;
  selectedIndex: number = -1;
  
  selectProvider(c: any, i: number) {
    // Nếu bấm vào lại đúng khách đang chọn thì ẩn đi
    if (this.selectedIndex === i) {
      this.selectedProvider = null;
      this.selectedIndex = -1;
    } else {
      this.selectedProvider = c;
      this.selectedIndex = i;
    }
  }
  getImageUrl(hinhAnh: string | null | undefined): string {
  if (!hinhAnh || hinhAnh.trim() === '') {
    return 'assets/default-avatar.png';
  }

  // Nếu là base64 (ảnh mới chọn nhưng chưa upload)
  if (hinhAnh.startsWith('data:image')) {
    return hinhAnh;
  }
  return `http://localhost:5262${hinhAnh}`;
}
// chuyển trạng thái dừng hoạt động
showConfirmModal = false;
showDisableSuccess = false;

// Khi bấm nút "Ngừng hoạt động"
confirmDisable(): void {
  this.showConfirmModal = true;
}

// Nếu hủy
cancelDisable(): void {
  this.showConfirmModal = false;
}

// Nếu xác nhận
disableProvider(): void {
  const formData = new FormData();
  formData.append('MaNCC', this.selectedProvider.MaNCC);
  formData.append('TenNCC', this.selectedProvider.TenNCC || '');
  formData.append('SDT', this.selectedProvider.SDT || '');
  formData.append('NhomNCC', this.selectedProvider.NhomNCC || '');
  formData.append('DiaChi', this.selectedProvider.DiaChi || '');
  formData.append('PhuongXa', this.selectedProvider.PhuongXa || '');
  formData.append('CongTy', this.selectedProvider.CongTy || '');
  formData.append('MaSoThue', this.selectedProvider.MaSoThue || '');
  formData.append('Email', this.selectedProvider.Email || '');
  formData.append('TrangThai', 'Ngừng hoạt động');
  formData.append('TongTien', this.selectedProvider.TongTien || '');
  formData.append('NguoiTao', this.selectedProvider.NguoiTao || '');
  formData.append('GhiChu', this.selectedProvider.GhiChu || '');


  this.providerService.update(this.selectedProvider.MaNCC, formData).subscribe({
    next: () => {
      this.showConfirmModal = false;
     this.toastMessage = 'Đã chuyển sang trạng thái ngừng hoạt động';
      this.showDeleteSuccess = true;
      setTimeout(() => this.showDisableSuccess = false, 3000);
      this.getAllProvider();
    },
    error: err => {
      console.error('Lỗi ngừng hoạt động:', err);
    }
  });
}
showDeleteModal = false;
showDeleteSuccess = false;
toastMessage = '';

// Khi bấm nút "Xóa"
confirmDelete(): void {
  this.showDeleteModal = true;
}

// Khi hủy
cancelDelete(): void {
  this.showDeleteModal = false;
}

// Khi xác nhận
deleteProvider(): void {
  debugger
  this.providerService.delete(this.selectedProvider.MaNCC).subscribe({
    next: () => {
      this.showDeleteModal = false;
      this.toastMessage = 'Đã xóa nhà cung cấp thành công';
      this.showDeleteSuccess = true;
      setTimeout(() => this.showDeleteSuccess = false, 3000);
      this.getAllProvider();
    },
    error: err => {
      console.error('Lỗi xóa:', err);
    }
  });
}
TenNhanVien: string = '';
addProvider(form: NgForm): void {
  if (form.invalid) return;

  const formData = new FormData();
  const values = form.value;

  // Gửi dữ liệu
  formData.append('MaNCC', this.Provider.MaNCC );  
  formData.append('TenNCC', values.TenNCC || '');
  formData.append('SDT', values.SDT || '');
  formData.append('DiaChi', values.DiaChi || '');
  formData.append('PhuongXa', values.phuongXa || '');
  formData.append('Email', values.Email || '');
  formData.append('CongTy', values.CongTy || '');
  formData.append('MaSoThue', values.MaSoThue || '');
  formData.append('NhomNCC', values.NhomNCC || '');
  formData.append('GhiChu', values.GhiChu || '');
  formData.append('TrangThai', 'Đang hoạt động');
  formData.append('NguoiTao', this.userName); // sửa khi làm xong đăng nhập
  const now = new Date();
  const formattedVN = now.toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).replace(' ', 'T');
  formData.append('NgayTao', formattedVN);  // ví dụ: 2025-05-28T10:15:00
  formData.append('TongTien', values.TongTien||'0');

if (this.addImageFile) {
  formData.append('HinhAnh', this.addImageFile);
}

  this.providerService.add(formData).subscribe({
    next: () => {
      this.showAddModal = false;
      this.toastMessage = 'Thêm nhà cung cấp thành công';
      this.showDeleteSuccess = true;
      setTimeout(() => this.showDeleteSuccess = false, 3000);
      this.getAllProvider(); // reload danh sách
    },
   error: err => {
  const errorMessage = err.error?.message || err.message || 'Lỗi không xác định';
  console.error('❌ Lỗi thêm nhà cung cấp:', errorMessage);


}

  });
}
isExporting: boolean = false;

exportFileExcel(): void {
  this.isExporting = true;
  this.providerService.exportToExcel().subscribe({
    next: (blob) => {
      const fileName = 'DanhSachNhaCungCap.xlsx';
      FileSaver.saveAs(blob, fileName);
       this.isExporting = false;
    },
    error: (err) => {
      console.error('❌ Lỗi xuất file:', err);
       this.isExporting = false;
    }
  });
}
showImportModal = false;

onOpenImportModal() {
  this.showImportModal = true;
}

closeImportModal() {
  this.showImportModal = false;
}
downloadTemplate(): void {
  this.providerService.downloadTemplate().subscribe({
    next: (blob) => {
      FileSaver.saveAs(blob, 'MauImport_NhaCungCap.xlsx');
    },
    error: (err) => {
      console.error('❌ Lỗi tải file mẫu:', err);
    }
  });}
onImportFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (!file) return;

  this.providerService.importNhaCungCap(file).subscribe({
    next: res => {
      alert(res.message || 'Import thành công!');
      this.closeImportModal();
      this.getAllProvider(); // load lại danh sách
    },
    error: err => {
      console.error('❌ Lỗi import:', err);
      alert('Import thất bại.');
    }
  });
}
// Biến phân trang
currentPage: number = 1;
pageSize: number = 10;
totalItems: number = 0;
totalPages: number = 0;

changePage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.getProviders();
  }
}
getProviders(): void {

  this.providerService.getAllPaginated(this.currentPage, this.pageSize).subscribe({
    next: res => {
     this.Providers = (res.data || []).map(p => ({ ...p, selected: false }));   
      this.totalItems = res.total;
      this.totalPages = Math.ceil(res.total / this.pageSize);
    
    },
    error: err => {
      console.error('Lỗi lấy danh sách nhà cung cấp:', err);
    }
  });
  
}
selectedNhomNCC: string = '';
selectedTrangThai: string = 'Đang hoạt động';



nhomNCCs: string[] = [];  // để hiển thị select
filterByGroup(): void {
  const params: any = {
    page: this.currentPage,
    pageSize: this.pageSize
  };

  if (this.selectedNhomNCC?.trim()) {
    params.nhomNCC = this.selectedNhomNCC.trim();
  }

  if (this.searchKeyword != null) {
    params.keyword = this.searchKeyword;
  }


  if (this.selectedTrangThai && this.selectedTrangThai !== 'tatca') {
    params.trangThai = this.selectedTrangThai;
  }

  if (this.fromAmount != null) {
    params.fromAmount = this.fromAmount;
  }

  if (this.toAmount != null) {
    params.toAmount = this.toAmount;
  }

  this.providerService.getFilteredProviders(params).subscribe({
  next: res => {
    console.log('📦 RES:', res);
    this.Providers = Array.isArray(res.data) ? res.data : [];
    this.totalItems = res.total;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  },
  error: err => {
    console.error('❌ Lỗi khi gọi API:', err);
    this.Providers = []; // fallback để tránh lỗi
  }
});

}

isAllSelected: boolean = false;
toggleAllCheckboxes(): void {
  this.Providers.forEach(p => p.selected = this.isAllSelected);
}
get hasSelectedProviders(): boolean {
  return this.Providers.some(p => p.selected);
}
confirmDeleteSelected(): void {
  const selected = this.Providers.filter(p => p.selected);
  if (selected.length === 0) return;

  if (confirm(`Bạn có chắc muốn xóa ${selected.length} nhà cung cấp?`)) {
    selected.forEach(p => {
      this.providerService.delete(p.MaNCC).subscribe({
        next: () => {
          console.log(`Đã xóa: ${p.MaNCC}`);
          this.getProviders();
        },
        error: err => {
          console.error(`❌ Lỗi xóa ${p.MaNCC}:`, err);
        }
      });
    });
  }
}
nhapHangHistory: NhapHang[] = [];

onTabChange(tabName: string) {
  this.tab = tabName;
  if (tabName === 'address' && this.selectedProvider?.MaNCC) {
    this.providerService.getNhapHangByMaNCC(this.selectedProvider.MaNCC)
      .subscribe({
        next: (res) => this.nhapHangHistory = res,
        error: (err) => console.error('Lỗi lấy lịch sử nhập hàng:', err)
      });
  }
}
printHistory() {
  if (!this.selectedProvider?.MaNCC) {
    console.error('❌ Không có nhà cung cấp được chọn!');
    return;
  }

  this.providerService.exportNhapHang(this.selectedProvider.MaNCC).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lich-su-nhap.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('❌ Lỗi khi xuất file lịch sử nhập hàng:', err);

      // Gợi ý debug nội dung nếu server trả về chuỗi lỗi
      if (err.error instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          console.error('📄 Chi tiết lỗi:', reader.result);
        };
        reader.readAsText(err.error);
      } else {
        alert('Lỗi không xác định khi xuất file.');
      }
    }
  });
}


}
