import { Routes } from '@angular/router';
import { CustomerComponent } from './partner/customer/customer.component';
import { EmployeePageComponent } from './employee-page/employee-page.component';
import { LayoutComponent } from './layout-component/layout-component.component';
import { DailyReportComponent } from './report/dailyreport/daily-report/daily-report.component';
import { PageSellreportComponent } from './report/sellreport/page-sellreport/page-sellreport.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'customer', pathMatch: 'full' },
      { path: 'customer', component: CustomerComponent },
      { path: 'employee', component: EmployeePageComponent },
      { path: 'DailyReport', component: DailyReportComponent },
      { path: 'SellReport', component: PageSellreportComponent }
    ]
  }
];