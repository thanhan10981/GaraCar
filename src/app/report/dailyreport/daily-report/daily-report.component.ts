import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { SidebarDailyReportComponent } from '../sidebar-daily-report/sidebar-daily-report.component';
import { TableDailyReportComponent } from '../table-daily-report/table-daily-report.component';




@Component({
  selector: 'app-daily-report',
  standalone: true,          
  imports: [
    TableDailyReportComponent,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,  // ✨ Thêm dòng này
    MatInputModule,
    SidebarDailyReportComponent
  ],
  
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css'] 
})
// daily-report.component.ts
export class DailyReportComponent {
  
}
