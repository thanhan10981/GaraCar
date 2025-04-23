import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css'
})
export class EmployeeTableComponent {
  employees = [
    {
      id: 'NV000002',
      name: 'Nguyễn Văn A',
      attendanceCode: '',
      phone: '1023385',
      identity: '',
      advance: 0,
      note: '',
      startDate: '',
      payBranch: 'Chi nhánh trung tâm',
      workBranch: 'Tất cả chi nhánh',
      email: ''
    },
    {
      id: 'NV000001',
      name: 'Ng V A',
      attendanceCode: '',
      phone: '',
      identity: '010200',
      advance: 0,
      note: '',
      startDate: '',
      payBranch: '',
      workBranch: '',
      email: ''
    }
  ];

  selectedEmployee: any = null;

  showDetail(emp: any) {
    this.selectedEmployee = emp;
  }
}
