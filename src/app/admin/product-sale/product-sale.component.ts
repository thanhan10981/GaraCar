import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SanPham } from '../model/model.component';
import { ProductSaleService } from '../service/product-sale.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-product-sale',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './product-sale.component.html',
  styleUrl: './product-sale.component.css'
})
export class ProductSaleComponent {
products: SanPham[] = [];
product: SanPham = this.GetProductEmty();
constructor(private router: Router,private productSaleService: ProductSaleService) {}
GetProductEmty(){
  return{
  MaSanPham: '',         
  TenSanPham:'',           
  AvatarPath:'',           
  MaLoaiHang:'',        
  GiaBan:'',      
  GiaVon:'',           
  TonKho:'',       
  ThoiGianTao:'',    
  DuKienHetSanPham:'',         
  LoaiHang:'',         
  }
}
  userRole= JSON.parse(localStorage.getItem('user') || '{}').ChucVu || '';
  userCode= JSON.parse(localStorage.getItem('user') || '{}').MaNhanVien || '';
  userName = JSON.parse(localStorage.getItem('user') || '{}').TenNhanVien || '';
ngOnInit() {
  this.productSaleService.getAllProducts().subscribe((data) => {
    this.products = data;
  });

  const savedTabs = localStorage.getItem('tabs');
  if (savedTabs) {
    this.tabs = JSON.parse(savedTabs);
  }
}
// lưu dữ liệu vào biến cục bộ
saveTabsToStorage() {
  localStorage.setItem('tabs', JSON.stringify(this.tabs));
}

isMenuOpen = false;

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}

getImageUrl(hinhAnh: string | null | undefined): string {
  return `http://localhost:5262${hinhAnh}`;
}
logout(){
    localStorage.removeItem('user');
    this.router.navigate(['/admin/login']);
  }
quantity: number = 1;
selectedProducts: any[] = [];

addProduct(product: any) {
  const tab = this.activeTab;
  const existing = tab.selectedProducts.find((p: any) => p.MaSanPham === product.MaSanPham);
  if (existing) {
    existing.quantity += 1;
  } else {
    tab.selectedProducts.push({ ...product, quantity: 1 });
  }
  this.saveTabsToStorage();
}



removeProduct(index: number) {
  const tab = this.activeTab;
  tab.selectedProducts.splice(index, 1);
  this.saveTabsToStorage();
}

increaseQty(item: any) {
  item.quantity += 1;
  this.saveTabsToStorage();
}

decreaseQty(item: any) {
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    const tab = this.activeTab;
    const index = tab.selectedProducts.indexOf(item);
    tab.selectedProducts.splice(index, 1);
  }
  this.saveTabsToStorage();
}


get tongSoLuong(): number {
  return this.activeTab?.selectedProducts.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
}

get tongTien(): number {
  return this.activeTab?.selectedProducts.reduce((sum: number, item: any) => sum + (item.GiaBan * item.quantity), 0) || 0;
}



toggleDropdown() {
  this.showDropdown = !this.showDropdown;
}
reloadPage() {
  debugger
  window.location.reload();
}

tabs: any[] = [
  { label: 'Hóa đơn 1', type: 'hoa-don', active: true, selectedProducts: [] }
];

get activeTab() {
  return this.tabs.find(t => t.active);
}

showDropdown = false;

addNewTab(type: string) {
  const count = this.tabs.filter(t => t.type === type).length + 1;
  let label = '';

  switch (type) {
    case 'hoa-don':
      label = `Hóa đơn ${count}`;
      break;
    case 'dat-hang':
      label = `Đặt hàng ${count}`;
      break;
    case 'sua-chua':
      label = `Sửa chữa ${count}`;
      break;
  }

  this.tabs.forEach(t => t.active = false);

  this.tabs.push({
    label,
    type,
    active: true,
    selectedProducts: []
  });

  this.saveTabsToStorage();
  this.showDropdown = false;
}



setActive(index: number) {
  this.tabs.forEach((t, i) => t.active = i === index);
}

removeTab(index: number) {
  this.tabs.splice(index, 1);
  if (this.tabs.length) this.tabs[0].active = true;
}

selectedProductDetail: any = null;

showDetail(item: any) {
  this.selectedProductDetail = item;
}

closeDetail() {
  this.selectedProductDetail = null;
}  
}
