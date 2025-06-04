import { Routes } from '@angular/router';
import { CustomerComponent } from './admin/partner/customer/customer.component';
import { DailyReportComponent } from './admin/report/dailyreport/daily-report/daily-report.component';
import { PageSellreportComponent } from './admin/report/sellreport/page-sellreport/page-sellreport.component';
import { ProviderComponent } from './admin/partner/provider/provider.component';
import { EmployeeComponent } from './admin/employee/employee.component';
import { CashBookComponent } from './admin/cash-book/cash-book.component';
import { HomeComponent } from './public/home/home.component';
import { PartsComponent } from './public/parts/parts.component';
import { ServicesComponent } from './public/services/services.component';
import { ContactComponent } from './public/contact/contact.component';
import { LayoutComponent } from './admin/layout-component/layout-component.component';
import { PublicLayoutComponent } from './public/layout/layout.component'; 
import { CartComponent } from './public/cart/cart.component';
import { BillComponent } from './admin/Transaction/Bill/hoadon.component';
import { ImportedGoodComponent} from './admin/Transaction/ImportedGoods/nhaphang.component';
import { OrderComponent } from './admin/Transaction/Order/dathang.component';
import { RepairBillComponent } from './admin/Transaction/RepairBill/hoadonsuachua.component';
import { RepairRequestComponent } from './admin/Transaction/RepairRequest/yeucausuachua.component';
import { ServiceComponent } from './admin/Transaction/Service/dichvu.component';
import { OverviewComponent } from './admin/overview/overviews/overview.component';
import { CategoryComponent } from './admin/Products/category/category.component';
import { InventoryComponent } from './admin/Products/inventory/inventory.component';
import { WarrantyCardComponent } from './admin/Products/warranty-card/warranty-card.component';
import { LoginComponent } from './public/login/login.component';
import { PageProductReportComponent } from './admin/report/productreport/page-product-report/page-product-report.component';
import { PageProviderComponent } from './admin/report/providerreport/page-provider/page-provider.component';
import { PageFinanceComponent } from './admin/report/financereport/page-finance/page-finance.component';
import { LoginAdminComponent } from './admin/login/login.component';
import { LoginLayoutComponent } from './admin/login-layout/login-layout.component';
import { ForgotPasswordComponent } from './admin/forgot-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductSaleComponent } from './admin/product-sale/product-sale.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: LoginLayoutComponent,  
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginAdminComponent },
      { path: 'forgotPassword', component: ForgotPasswordComponent }
    ]
  },
  {
    path: 'admin',
    component: LoginLayoutComponent,  
     canActivate: [AuthGuard],
     children: [
       { path: 'productSale', component: ProductSaleComponent },
    ]
  },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'customer', component: CustomerComponent },
      { path: 'DailyReport', component: DailyReportComponent },
      { path: 'SellReport', component: PageSellreportComponent },
      { path: 'provider', component: ProviderComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'cashBook', component: CashBookComponent },
      { path: 'bill', component: BillComponent },
      { path: 'importedGood', component: ImportedGoodComponent },
      { path: 'order', component: OrderComponent },
      { path: 'repairBill', component: RepairBillComponent },
      { path: 'repairRequest', component: RepairRequestComponent },
      { path: 'service', component: ServiceComponent },
      { path: 'overview', component: OverviewComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'warrantyCard', component: WarrantyCardComponent },
      { path: 'producTreport', component: PageProductReportComponent },
      { path: 'providerReport', component: PageProviderComponent },
      { path: 'financeReport', component: PageFinanceComponent },
    
    ]
  },
  {
    path: 'public',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'parts', component: PartsComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'cart', component: CartComponent },
      { path: 'login', component: LoginComponent },
    ]
  },
  { path: '**', redirectTo: 'admin', pathMatch: 'full' }
];
