import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartProductComponent } from '../chart-product/chart-product.component';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-overview',
  imports: [CommonModule,ChartComponent,ChartProductComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  todayStats = {
    orders: 0,
    returns: 0,
    revenue: 0,
    changePercent: -20.89
  };

  monthlyRevenue = [
    { day: '01', amount: 90 },
    { day: '02', amount: 15 },
    { day: '03', amount: 65.37 },
    { day: '04', amount: 85 },
    { day: '05', amount: 50 },
    { day: '06', amount: 25 },
    { day: '07', amount: 30 },
    { day: '08', amount: 40 },
    { day: '09', amount: 38 },
    { day: '10', amount: 35 },
    { day: '11', amount: 70 },
    { day: '12', amount: 20 },
    { day: '13', amount: 33 },
    { day: '14', amount: 75 },
    { day: '15', amount: 27 },
    { day: '16', amount: 85 },
    { day: '17', amount: 88 },
    { day: '18', amount: 60 },
    { day: '19', amount: 100 }
  ];

  topProducts = [
    { name: 'Quạt đứng Asia A16009', revenue: 30 },
    { name: 'Ổ cắm Bals', revenue: 10 }
  ];

  activities = [
    { type: 'sale', user: 'Anh', amount: 455000, time: '5 ngày trước' },
    { type: 'receive', user: 'Anh', amount: 455000, time: '5 ngày trước' },
    { type: 'sale', user: 'Nguyễn Lê Hùng Cường', amount: 97320000, time: '5 ngày trước' },
    { type: 'return', user: 'Hoàng Nam Quang', amount: 15840000, time: '6 ngày trước' }
  ];

  constructor() {}
  ngOnInit(): void {}
}
