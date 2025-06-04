import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import CryptoJS from 'crypto-js'; // cài lệnh npm install crypto-js
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { NhanVien } from '../model/model.component';
import { EmployeeService } from '../service/employee.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-employee',
  standalone:true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent,MatDatepickerModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  tab: string = 'info';
  Employees :NhanVien[] = [];
  Employee :NhanVien = this.getEmptyEmployee();
 Success = false;
  toastMessage = '';
  searchKeyword = '';
  showDropdown = false;
  showForm = false;
  showFormAdd = false;
  
  filteredEmployees: NhanVien[] = [];  // danh sách sau khi lọc
selectedChucVu: string = '';
chucVuList: string[] = [];

selectedTrangThai: string = '';
  userRole= JSON.parse(localStorage.getItem('user') || '{}').ChucVu || '';
  userCode= JSON.parse(localStorage.getItem('user') || '{}').MaNhanVien || '';
  userName = JSON.parse(localStorage.getItem('user') || '{}').TenNhanVien || '';
constructor( private http: HttpClient, private EmployeeService:EmployeeService){}

ngOnInit(): void {
  this.getAllEmployee();
  this.selectedTrangThai = 'Đang hoạt động';
}
 getAllEmployee() {
  this.EmployeeService.getAll().subscribe(res => {
    this.Employees = res;
    this.filteredEmployees = res;
    this.extractChucVus(); // ✅ Lấy danh sách chức vụ
    this.updatePagedEmployees();
  });
}

// ✅ Lọc danh sách chức vụ duy nhất
extractChucVus() {
  const roles = this.Employees.map(emp => emp.ChucVu).filter(role => !!role); // bỏ null
  this.chucVuList = Array.from(new Set(roles)); // loại trùng
}

  getEmptyEmployee(){
    return{
      MaNhanVien: '',     
      TenNhanVien: '',   
      SoDienThoai: '',       
      NgaySinh:'' ,          
      GioiTinh: '',        
      DiaChi:'' ,          
      NgayBatDau: '',      
      ChucVu:'' ,        
      TaiKhoanDangNhap:'' ,
      MatKhau: '',        
      CmndCccd:'' ,           
      Email: '',       
      Facebook:'' ,          
      HinhAnh: '',   
      GhiChu: '',   
      TrangThai:''      
    }
  }
 
  openModalAdd(){
    this.showFormAdd = true;
     this.Employee.MaNhanVien = this.generateNextMaNhanVien();
  }
  closeModalAdd() {
    this.showFormAdd = false;
  }
  openModal(){
    
    this.showForm = true;
  }
  closeModal() {
    this.showForm = false;
  }

  selectedEmployee: any = null;
  selectedIndex: number = -1;
  selectEmployee(c: any, i: number) {
    if (this.selectedIndex === i) {
      this.selectedEmployee = null;
      this.selectedIndex = -1;
    } else {
      this.selectedEmployee = c;
      this.selectedIndex = i;
    }
  }
  //lấy ảnh nhân viên
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
updateImageUrl: string = '';
updateImageFile: File | null = null;

@ViewChild('imageInput') updateImageInput!: ElementRef;

updateselectAddImage(): void {
  const file = document.querySelector('input[type="file"]') as HTMLInputElement;
  file?.click();
}
updateonAddImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.updateImageFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.updateImageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
generateNextMaNhanVien(): string {
  // Lọc ra những mã hợp lệ bắt đầu bằng "NV"
  const maList = this.Employees
    .map(e => e.MaNhanVien)
    .filter(ma => /^NV\d+$/.test(ma)); // chỉ lấy dạng NVxxx

  if (maList.length === 0) return 'NV001';

  // Lấy số lớn nhất
  const maxSo = Math.max(...maList.map(ma => parseInt(ma.slice(2))));
  const nextSo = (maxSo + 1).toString().padStart(3, '0');

  return `NV${nextSo}`;
}

save() {
  const formData = new FormData();
  formData.append('MaNhanVien', this.Employee.MaNhanVien || '');
  formData.append('TenNhanVien', this.Employee.TenNhanVien || '');
  formData.append('SoDienThoai', this.Employee.SoDienThoai || '');
  formData.append('NgaySinh', this.Employee.NgaySinh || '');
  formData.append('GioiTinh', this.Employee.GioiTinh || '');
  formData.append('DiaChi', this.Employee.DiaChi || '');
  formData.append('NgayBatDau', this.Employee.NgayBatDau || '');
  formData.append('ChucVu', this.Employee.ChucVu || '');
  formData.append('TaiKhoanDangNhap', this.Employee.TaiKhoanDangNhap || '');
  const hashedPassword = CryptoJS.SHA256(this.Employee.MatKhau || '').toString(); // cài lệnh npm install crypto-js
  formData.append('MatKhau', hashedPassword);
  formData.append('CmndCccd', this.Employee.CmndCccd || '');
  formData.append('Email', this.Employee.Email || '');
  formData.append('Facebook', this.Employee.Facebook || '');
  formData.append('TrangThai', 'Đang hoạt động');
  formData.append('GhiChu', this.Employee.GhiChu || '');

  if (this.addImageFile) {
    formData.append('HinhAnh', this.addImageFile);  // OK vì đã check null
  }
    this.EmployeeService.createNhanVien(formData).subscribe({
      next: () => {
      this.toastMessage = 'Thêm nhân viên thành công';
      this.Success = true;
      setTimeout(() => this.Success = false, 3000);
        this.getAllEmployee();
        this.showFormAdd = false;
       
      },
     error: (err) => {
    console.error('❌ Chi tiết lỗi:', err);
    }
    });
  }
updateNhanVien() {
  debugger
  const formData = new FormData();

  formData.append('MaNhanVien', this.selectedEmployee.MaNhanVien || '');
  formData.append('TenNhanVien', this.selectedEmployee.TenNhanVien || '');
  formData.append('SoDienThoai', this.selectedEmployee.SoDienThoai || '');
  formData.append('NgaySinh', this.selectedEmployee.NgaySinh || '');
  formData.append('GioiTinh', this.selectedEmployee.GioiTinh || '');
  formData.append('DiaChi', this.selectedEmployee.DiaChi || '');
  formData.append('NgayBatDau', this.selectedEmployee.NgayBatDau || '');
  formData.append('ChucVu', this.selectedEmployee.ChucVu || '');
  formData.append('TaiKhoanDangNhap', this.selectedEmployee.TaiKhoanDangNhap || '');
  formData.append('MatKhau', this.selectedEmployee.MatKhau || '');
  formData.append('CmndCccd', this.selectedEmployee.CmndCccd || '');
  formData.append('Email', this.selectedEmployee.Email || '');
  formData.append('Facebook', this.selectedEmployee.Facebook || '');
  formData.append('TrangThai',  'Đang hoạt động');
  formData.append('GhiChu', this.selectedEmployee.GhiChu || '');

  if (this.selectedEmployee.HinhAnh) {
    formData.append('HinhAnh', this.selectedEmployee.HinhAnh);
  }
  if(this.updateImageFile){
     formData.append('HinhAnh', this.updateImageFile);
  }

  this.EmployeeService.updateNhanVien(this.selectedEmployee.MaNhanVien, formData).subscribe({
    next: () => {
      this.toastMessage = 'Cập nhật nhân viên thành công',
      this.Success = true;
      setTimeout(() => this.Success = false, 3000);
        this.getAllEmployee();
        this.showForm = false;
        this.Employees = [];  
        this.addImageFile = null;
        this.selectedIndex = -1;
    },
    error: () => alert('Lỗi cập nhật')
  });
}
showConfirmModal: boolean = false;
openConfirmModal() {
  this.showConfirmModal = true;
}

closeConfirmModal() {
  this.showConfirmModal = false;
}

// ✅ Gọi API hoặc đổi trạng thái
deactivateEmployee() {
  const formData = new FormData();
  formData.append('MaNhanVien', this.selectedEmployee.MaNhanVien || '');
  formData.append('TenNhanVien', this.selectedEmployee.TenNhanVien || '');
  formData.append('SoDienThoai', this.selectedEmployee.SoDienThoai || '');
  formData.append('NgaySinh', this.selectedEmployee.NgaySinh || '');
  formData.append('GioiTinh', this.selectedEmployee.GioiTinh || '');
  formData.append('DiaChi', this.selectedEmployee.DiaChi || '');
  formData.append('NgayBatDau', this.selectedEmployee.NgayBatDau || '');
  formData.append('ChucVu', this.selectedEmployee.ChucVu || '');
  formData.append('TaiKhoanDangNhap', this.selectedEmployee.TaiKhoanDangNhap || '');
  formData.append('MatKhau', this.selectedEmployee.MatKhau || '');
  formData.append('CmndCccd', this.selectedEmployee.CmndCccd || '');
  formData.append('Email', this.selectedEmployee.Email || '');
  formData.append('Facebook', this.selectedEmployee.Facebook || '');
  formData.append('GhiChu', this.selectedEmployee.GhiChu || '');
  formData.append('TrangThai', 'Ngừng hoạt động');

  this.EmployeeService.updateNhanVien(this.selectedEmployee.MaNhanVien, formData).subscribe({
    next: () => {
      this.toastMessage = 'Ngừng hoạt động thành công';
      this.getAllEmployee();
      this.showConfirmModal = false;
      this.toastMessage = 'Trạng thái nhân viên cập nhật thành công',
      this.Success = true;
      setTimeout(() => this.Success = false, 3000);
    },
    error: (err) => {
      console.error('❌ Lỗi ngừng hoạt động:', err);
      this.toastMessage = 'Lỗi khi ngừng hoạt động';
    }
  });
}

showDeleteConfirm: boolean = false;

// Mở modal xác nhận
openDeleteConfirmModal() {
  if (this.selectedEmployee) {
    this.showDeleteConfirm = true;
  }
}

// Đóng modal xác nhận
closeDeleteConfirm() {
  this.showDeleteConfirm = false;
}

// Gọi API xóa
deleteEmployee() {
  if (!this.selectedEmployee?.MaNhanVien) return;

  this.EmployeeService.deleteNhanVien(this.selectedEmployee.MaNhanVien).subscribe({
    next: () => {
      this.toastMessage = 'Đã xóa nhân viên thành công';
      this.Success = true;
      setTimeout(() => this.Success = false, 3000);

      this.getAllEmployee(); // Refresh danh sách
      this.closeDeleteConfirm();
    },
    error: (err) => {
      console.error('❌ Lỗi xóa:', err);
    }
  });
}

 // ✅ Thêm vào component
currentPage: number = 1;
pageSize: number = 10; // số nhân viên mỗi trang

get paginatedEmployees(): NhanVien[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.Employees.slice(start, start + this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.Employees.length / this.pageSize);
}
pagedEmployees: NhanVien[] = [];
 filterEmployees(): void {
  const filtered = this.Employees.filter(emp => {
    const matchTrangThai = this.selectedTrangThai === '' || emp.TrangThai === this.selectedTrangThai;
    const matchChucVu = this.selectedChucVu === '' || emp.ChucVu === this.selectedChucVu;
    const keyword = this.searchKeyword.toLowerCase();
    const matchKeyword =
    emp.MaNhanVien?.toLowerCase().includes(keyword) ||
    emp.TenNhanVien?.toLowerCase().includes(keyword) ||
    emp.SoDienThoai?.toLowerCase().includes(keyword) ||
    emp.ChucVu?.toLowerCase().includes(keyword) ||
    emp.Email?.toLowerCase().includes(keyword) ||
    emp.DiaChi?.toLowerCase().includes(keyword) ||
    emp.Facebook?.toLowerCase().includes(keyword);
    emp.CmndCccd?.toLowerCase().includes(keyword);
    emp.GioiTinh?.toLowerCase().includes(keyword);

    return matchTrangThai && matchChucVu && matchKeyword;
  });

  this.filteredEmployees = filtered;
  this.currentPage = 1; // reset về trang đầu
  this.updatePagedEmployees();
}
updatePagedEmployees(): void {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.pagedEmployees = this.filteredEmployees.slice(start, end);
}
goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.updatePagedEmployees();
  }
}
@ViewChild('importInput') importInput!: ElementRef<HTMLInputElement>;

showImportModal: boolean = false;

openImportForm() {
  this.showImportModal = true;
}

closeImportForm() {
  this.showImportModal = false;
  if (this.importInput) this.importInput.nativeElement.value = '';
}

downloadTemplate() {
  this.http.get('https://localhost:7037/api/NhanViens/template', { responseType: 'blob' })
    .subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('❌ Tải file mẫu thất bại:', err);
      }
    });
}


// Upload file import Excel
onImportExcel(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  this.http.post('https://localhost:7037/api/NhanViens/import', formData).subscribe({
    next: () => {
      this.closeImportForm();
      this.getAllEmployee();
      this.toastMessage = 'Import thành công';
      this.Success = true;
      setTimeout(() => this.Success = false, 3000);
    },
    error: (err) => {
      this.toastMessage = 'lỗi Import';
      this.Success = true;
      setTimeout(() => this.Success = false, 3000);
    }
  });
}
isExporting: boolean = false;

exportToExcel() {
  this.isExporting = true;
  this.http.get('https://localhost:7037/api/NhanViens/export', {
  responseType: 'blob'
}).subscribe({
  next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);
      this.isExporting = false;
      this.toastMessage = 'Xuất file thành công';
      this.Success = true;
      setTimeout(() => this.Success = false, 3000);
    },
    error: (err) => {
      console.error('❌ Lỗi xuất file:', err);
      this.toastMessage = '❌ Xuất file thất bại';
      this.Success = true;
      setTimeout(() => this.Success = false, 3000);
       this.isExporting = false;
    }
  });
}




}
