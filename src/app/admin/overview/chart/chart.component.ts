import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  isBrowser = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {//ko xóa cái này
    this.isBrowser = isPlatformBrowser(platformId);
  }


view: [number, number] = [1120, 470];
  currentView: 'day' | 'month' = 'day';

  revenueDaily = [
    { name: '13', value: 2700000 },
    { name: '14', value: 600000 },
    { name: '15', value: 2800000 },
    { name: '16', value: 500000 },
    { name: '17', value: 1200000 },
    { name: '18', value: 600000 },
    { name: '19', value: 650000 },
    { name: '20', value: 2800000 },
    { name: '21', value: 600000 },
    { name: '22', value: 2700000 },
    { name: '23', value: 1000000 },
    { name: '24', value: 200000 },
    { name: '25', value: 2600000 },
    { name: '26', value: 2300000 },
    { name: '27', value: 1800000 },
    { name: '28', value: 600000 },
    { name: '29', value: 900000 },
    { name: '30', value: 2400000 },
    { name: '31', value: 700000 },
  ];

  revenueMonthly = [
    { name: 'Tháng 1', value: 18000000 },
    { name: 'Tháng 2', value: 21000000 },
    { name: 'Tháng 3', value: 24000000 },
    { name: 'Tháng 4', value: 20000000 },
    { name: 'Tháng 5', value: 27000000 },
    { name: 'Tháng 6', value: 25000000 },
    { name: 'Tháng 7', value: 30000000 },
    { name: 'Tháng 8', value: 32000000 },
    { name: 'Tháng 9', value: 29000000 },
    { name: 'Tháng 10', value: 31000000 },
    { name: 'Tháng 11', value: 33000000 },
    { name: 'Tháng 12', value: 35000000 },
  ];

  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;

  xAxisLabel = 'Ngày';
  yAxisLabel = 'Doanh thu';

  yAxisTickFormatting = (value: number): string => {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' tr';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(0) + 'k';
    }
    return value.toString();
  };

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#0aaf96', '#0c9983', '#0cc1a8',
      '#087d6f', '#1ed7bc', '#0aaf96aa'
    ]
  };

  toggleView(): void {
    this.currentView = this.currentView === 'day' ? 'month' : 'day';
    this.xAxisLabel = this.currentView === 'day' ? 'Ngày' : 'Tháng';
  }
}