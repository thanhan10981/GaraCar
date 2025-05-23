import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from "../../footer/footer.component";
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { KhachHang } from '../../model/model.component';
import { CustomerService } from '../../service/customer.service';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent,MatDatepickerModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  selectedFile: File | null = null;
  tab: string = 'info';
  activeTabGroupKH = 'info';
  selectedOption = 'code';
  selectedOptionLabel = 'Theo mã, tên, điện thoại';
  searchKeyword = '';
  showDropdown = false;
  showForm = false;
  showFormAdd = false;
  isVertical: boolean = false;
  selectedInterest: string = 'Bán hàng';
  interestOptions: string[] = ['Bán hàng', 'Thu chi', 'Hàng hóa', 'Tổng hợp'];
  selectedGroup = '';
  selectedCreator = '';
  selectedLoaiKhach = 'tatca';
  selectedTrangThai = 'danghoatdong';
  selectAll: boolean = false; // dùng chọn tất cả các khách hàng
  selectedTime = 'today';
  todayLabel = this.getTodayLabel();
  selectedDay: string = '';
  showDateRange: boolean = false;
  showSuccess = false;
  showSuccessde = false;
  customerImageUrl: string | ArrayBuffer | null = null;
  customers: KhachHang[] = [];
  customer: KhachHang = this.getEmptyCustomer();
 
  constructor( private http: HttpClient, private cdRef: ChangeDetectorRef,private fb: FormBuilder, private customerService: CustomerService) {
  }
  save(form: NgForm): void {
  const lastCode = this.getLastCustomerCode();
  const nextCode = this.generateNextCustomerCode(lastCode);
  this.customer.MaKhachHang = nextCode;
  this.customer.NguoiTao = "admin";// xử lý lại khi làm xong đăng nhập
  const now = new Date();
  this.customer.NgayTao = now.toISOString(); 
  this.customer.TrangThai = 'Đang hoạt động';
  // 2. Tạo FormData để gửi cả text + file
  const formData = new FormData();

  // 3. Append các trường văn bản vào FormData
 for (let key in this.customer) {
  if (this.customer.hasOwnProperty(key)) {
    let value = (this.customer as any)[key];
    // Nếu null, undefined hoặc chuỗi rỗng thì gán mặc định
    if (value === null || value === undefined || value === '') {
      value = 'Xin vui lòng cập nhật thông tin';
    }
    formData.append(key, value);
  }
}


  // 4. Append ảnh nếu có chọn ảnh mới
  if (this.selectedFile) {
    formData.append('HinhAnh', this.selectedFile);
  }

  // 5. Gửi FormData lên backend
 this.customerService.add(formData).subscribe(() => {
    this.getAllCustomers();
    this.resetForm(form);
    this.showSuccess = true;
    this.showFormAdd = false;
    setTimeout(() => this.showSuccess = false, 3000);
  });
}

  resetForm(form: NgForm) {
    this.customer = this.getEmptyCustomer();
    form.resetForm();
  }
  generateNextCustomerCode(lastCode: string): string {
  const prefix = 'KH';
  const numberPart = lastCode.replace(prefix, ''); // "000015"
  const nextNumber = parseInt(numberPart, 10) + 1;
  const nextNumberStr = nextNumber.toString().padStart(6, '0'); // "000016"
  return prefix + nextNumberStr;
}
getLastCustomerCode(): string {
  if (!Array.isArray(this.customers) || this.customers.length === 0) {
    // Nếu không có khách hàng nào thì bắt đầu từ mã đầu tiên
    return 'KH000000';
  }

  const codes = this.customers.map(c => c.MaKhachHang).filter(Boolean); // lọc bỏ null/undefined

  // Nếu vẫn không có mã hợp lệ
  if (codes.length === 0) return 'KH000000';

  // Sắp xếp theo số
  codes.sort((a, b) => {
    const numA = parseInt(a.replace('KH', ''), 10);
    const numB = parseInt(b.replace('KH', ''), 10);
    return numA - numB;
  });

  return codes[codes.length - 1];
}


ngOnInit(): void {
  this.getAllCustomers();
}

  getAllCustomers(): void {
    this.customerService.getAll().subscribe(
      (data) => {
        this.customers = data;
        this.updatePagedCustomers();

        // console.log('Danh sách khách hàng:', data);
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách khách hàng:', error);
      }
    );
  }
//cập nhật khách hàng
updateCustomer(form: NgForm): void {
  const formData = new FormData();
  formData.append('MaKhachHang', this.SelectedCustomer.MaKhachHang || '');
  formData.append('TenKhachHang', this.SelectedCustomer.TenKhachHang || '');
  formData.append('SoDienThoai', this.SelectedCustomer.SoDienThoai || '');
  formData.append('Email', this.SelectedCustomer.Email || '');
  formData.append('DiaChi', this.SelectedCustomer.DiaChi || '');
  formData.append('NgaySinh', this.SelectedCustomer.NgaySinh || '');
  formData.append('GioiTinh', this.SelectedCustomer.GioiTinh || '');
  formData.append('LoaiKhach', this.SelectedCustomer.LoaiKhach || '');
  formData.append('MaSoThue', this.SelectedCustomer.MaSoThue || '');
  formData.append('CmndCccd', this.SelectedCustomer.CmndCccd || '');
  formData.append('Facebook', this.SelectedCustomer.Facebook || '');
  formData.append('GhiChu', this.SelectedCustomer.GhiChu || '');
  formData.append('NgayTao', this.SelectedCustomer.NgayTao || '');
  formData.append('NguoiTao', this.SelectedCustomer.NguoiTao || '');
  formData.append('TrangThai', this.SelectedCustomer.TrangThai || '');
  if (this.selectedFile) {
  formData.append('HinhAnh', this.selectedFile);
}

  this.customerService.update(this.SelectedCustomer.MaKhachHang, formData).subscribe({
  next: () => {
    this.resetForm(form);
    setTimeout(() => {
        this.getAllCustomers(); 
      }, 3300); // Delay nhẹ cho server kịp phản hồi
    this.closeModal(); // đóng form nếu có
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 3000);
    
  },
  error: (err) => {
    console.error("❌ Lỗi cập nhật:", err);
  }
});

}


onImageSelected(event: any, target: 'create' | 'update') {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result as string;
      if (target === 'create') {
        this.customer.HinhAnh = imgUrl;
      } else {
        this.SelectedCustomer.HinhAnh = imgUrl;
      }
    };
    reader.readAsDataURL(file);
  }
}


showDeleteConfirm = false;
customerToDelete: string | null = null;

openDeleteConfirm(ma: string) {
  this.customerToDelete = ma;
  this.showDeleteConfirm = true;
}

cancelDeleteCustomer() {
  this.showDeleteConfirm = false;
  this.customerToDelete = null;
}

confirmDeleteCustomer() {
  debugger
  if (!this.customerToDelete) return;
  this.customerService.delete(this.customerToDelete).subscribe({
    next: (res) => {
      console.log('✅ Xóa khách hàng thành công:', res);
      this.getAllCustomers();
      this.showDeleteConfirm = false;
      this.customerToDelete = null;
      this.showSuccessde = true;
    setTimeout(() => this.showSuccess = false, 3000);
    },
    error: (err) => {
      console.error('❌ Lỗi khi xóa khách hàng:', err);
    }
  });
}

private getEmptyCustomer(): KhachHang {
  return { 
    MaKhachHang: '', 
    TenKhachHang: '', 
    SoDienThoai: '', 
    DiaChi: '', 
    GhiChu: '', 
    CmndCccd: '', 
    NgaySinh: '', 
    GioiTinh: '', 
    LoaiKhach: '', 
    MaSoThue: '', 
    Email: '', 
    Facebook: '', 
    HinhAnh: '' ,
    NguoiTao:'',
    NgayTao:'',
    TrangThai:''
  };
}
 SelectedCustomer: any = {};

  openModal(customer: any) {
    this.SelectedCustomer = { ...customer };
    this.showForm = true;
  }

  closeModal() {
    this.showForm = false;
    this.SelectedCustomer = {};
  }

  @ViewChild('picker') picker!: MatDatepicker<Date>;

  openModalAdd(){
    this.showFormAdd = true;
  }
  closeModalAdd() {
    this.showFormAdd = false;
  }

searchOptions = [
  { label: 'Mã KH', value: 'code' },
  { label: 'Email', value: 'email' },
  { label: 'Địa chỉ', value: 'address' },
  { label: 'Ghi chú', value: 'note' }
];


toggleDropdown() {
  this.showDropdown = !this.showDropdown;
}

selectOption(option: any) {
  this.selectedOption = option.value;
  this.selectedOptionLabel = option.label;
  this.showDropdown = false;
}



  
  openDatepicker() {
    this.picker.open();
  }

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
 
fromDate: Date | null = null;
toDate: Date | null = null;

onTimeChange() {
  if (this.selectedTime === 'custom') {
    this.showDateRange = true;
  } else if (this.selectedTime === 'today') {
    this.showDateRange = false;
    const today = new Date();
    this.fromDate = new Date(today.setHours(0, 0, 0, 0));
    this.toDate = new Date();
    this.filterCustomers(); // tự động lọc khi chọn hôm nay
  }
}

 selectedCustomer: KhachHang | null = null;
 selectedIndex: number = -1;
 // chọn khách hàng tương ứng
selectCustomer(c: KhachHang, i: number) {
  if (this.selectedIndex === i) {
    this.selectedCustomer = null;
    this.selectedIndex = -1;
  } else {
    // Gán đúng đối tượng khách hàng
    this.selectedCustomer = c;
    this.selectedIndex = i;
  }
}
// lọc khách hàng
filterCustomers(): void {
  const params: any = {
    creator: this.selectedCreator || '',
    loaiKhach: this.selectedLoaiKhach !== 'tatca' ? this.selectedLoaiKhach : '',
    trangThai: this.selectedTrangThai !== 'tatca' ? this.selectedTrangThai : '',
    search: this.searchKeyword || '',
    searchType: this.selectedOption || '',
    fromDate: this.fromDate ? new Date(this.fromDate + 'T00:00:00') : null,
    toDate: this.toDate ? new Date(this.toDate + 'T23:59:59') : null,
  };

  this.customerService.getFilteredCustomers(params).subscribe({
    next: (data) => this.customers = data,
    error: (err) => console.error('❌ Lỗi lọc khách hàng:', err)
  });
}


//tìm kiếm
onSearch() {
  this.filterCustomers();
}
// Dùng cho các ảnh ngoài danh sách (hiển thị chung)
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

// Dùng riêng cho ảnh khi cập nhật
getSelectedCustomerImage(): string {
  const img = this.SelectedCustomer?.HinhAnh;

  if (!img || img.trim() === '') {
    return 'assets/default-avatar.png';
  }

  // Nếu là base64 (xem trước ảnh vừa chọn)
  if (img.startsWith('data:image')) {
    return img;
  }
  return `http://localhost:5262${img}`;
}

showConfirmBox = false;
customerToDeactivate: any; // hoặc kiểu đúng: Customer
//xác nhận dừng hoạt động khách hàng
confirmDeactivation(customer: any) {
  this.customerToDeactivate = customer;
  this.showConfirmBox = true;
}
//hủy
cancelDeactivation() {
  this.showConfirmBox = false;
  this.customerToDeactivate = null;
}
//cập nhật khách hàng thành ngừng hoạt động
deactivateCustomer() {
  if (!this.customerToDeactivate || !this.customerToDeactivate.MaKhachHang) {
    console.error('❌ Không có khách hàng hợp lệ để cập nhật');
    return;
  }

  const formData = new FormData();

  // Gán tất cả các trường cần thiết vào formData
  formData.append('MaKhachHang', this.customerToDeactivate.MaKhachHang.trim());
  formData.append('TenKhachHang', this.customerToDeactivate.TenKhachHang || '');
  formData.append('SoDienThoai', this.customerToDeactivate.SoDienThoai || '');
  formData.append('Email', this.customerToDeactivate.Email || '');
  formData.append('DiaChi', this.customerToDeactivate.DiaChi || '');
  formData.append('NgaySinh', this.customerToDeactivate.NgaySinh || '');
  formData.append('GioiTinh', this.customerToDeactivate.GioiTinh || '');
  formData.append('LoaiKhach', this.customerToDeactivate.LoaiKhach || '');
  formData.append('MaSoThue', this.customerToDeactivate.MaSoThue || '');
  formData.append('CmndCccd', this.customerToDeactivate.CmndCccd || '');
  formData.append('Facebook', this.customerToDeactivate.Facebook || '');
  formData.append('GhiChu', this.customerToDeactivate.GhiChu || '');
  formData.append('TrangThai', 'Ngừng hoạt động');

  this.customerService.update(this.customerToDeactivate.MaKhachHang, formData).subscribe({
    next: (res) => {
        this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 3000);
      this.showConfirmBox = false;
      this.customerToDeactivate = null;
      this.getAllCustomers();
   
    },
    error: (err) => {
      console.error('❌ Lỗi khi gọi API:', err);
    }
  });
}
// tùy chọn bỏ 1 khách hàng
updateSelectAll() {
  this.selectAll = this.customers.every(c => c.selected);
}
//chọn tất cả khách hàng
toggleAll() {
  this.customers.forEach(c => c.selected = this.selectAll);
}
//hàm kiểm tra khách hàng đã chọn chưa
anyCustomerSelected(): boolean {
  return this.customers.some(c => c.selected);
}
showDeleteConfirmModal = false;
selectedIdsToDelete: string[] = [];

// hàm xác nhận xóa
confirmDeleteSelected() {
  this.selectedIdsToDelete = this.customers
    .filter(c => c.selected)
    .map(c => c.MaKhachHang);

  if (this.selectedIdsToDelete.length === 0) return;

  this.showDeleteConfirmModal = true;
}

// xóa nhiều khách hàng
deleteMultipleCustomers(maList: string[]) {
  const deleteRequests = maList.map(ma =>
    this.customerService.delete(ma)
  );

  forkJoin(deleteRequests).subscribe({
    next: () => {
      this.getAllCustomers();
      this.selectAll = false; // bỏ chọn tất cả
    },
    error: (err) => {
      console.error("❌ Lỗi khi xóa hàng loạt:", err);
    }
  });
}
deleteSelectedConfirmed() {
  this.deleteMultipleCustomers(this.selectedIdsToDelete);
  this.showDeleteConfirmModal = false;
   this.showSuccessde = true;
  setTimeout(() => this.showSuccessde = false, 3000);
}


pageSize = 10;
currentPage = 1;
pagedCustomers: KhachHang[] = [];

updatePagedCustomers() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.pagedCustomers = this.customers.slice(startIndex, endIndex);
}

get totalPages(): number {
  return Math.ceil(this.customers.length / this.pageSize);
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePagedCustomers();
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePagedCustomers();
  }
}
//xuất file
goToPage(page: number) {
  this.currentPage = page;
  this.updatePagedCustomers();
}
exportToExcel(): void {
  this.http.get('https://localhost:7037/api/KhachHangs/export', {
    responseType: 'blob'
  }).subscribe(blob => {
    saveAs(blob, `KhachHang_${new Date().toISOString().slice(0,10)}.xlsx`);
  });
}
// import file
showImportForm = false;
selectedImportFile: File | null = null;
onFileSelected(event: any): void {
  this.selectedImportFile = event.target.files[0];
}
showSuccesskh = false;
uploadFile(): void {
  if (!this.selectedImportFile) return;

  const formData = new FormData();
  formData.append('file', this.selectedImportFile);
 
  this.http.post('https://localhost:7037/api/KhachHangs/import', formData)
    .subscribe({
      next: (res) => {
        console.log("✅ Import kết quả:", res); 
        this.getAllCustomers(); 
        this.showImportForm = false; 
        this.showSuccesskh = true;   

        setTimeout(() => {
          this.showSuccesskh = false; 
        }, 3000);
      },
      error: err => {
        console.error('❌ Import lỗi:', err);
      }
    });
}







}




