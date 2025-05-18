import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart-product',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './chart-product.component.html',
  styleUrl: './chart-product.component.css'
})
export class ChartProductComponent {
  view: [number, number] = [1120, 470];

  revenueData: any[] = [];

  ngOnInit() {
    const rawData = [
      { name: 'Ổn áp LIOA 1p Dri - 1kva', value: 3200000, quantity: 32 },
      { name: 'Máy khoan Bosch GSB 550', value: 2800000, quantity: 28 },
      { name: 'Đèn led Philips 18W', value: 2500000, quantity: 50 },
    ];

   
    const top10 = rawData
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  this.revenueData = this.formatRevenueData(top10);
  }
  showXAxis = true;
showYAxis = true;
showLegend = false;

// Trục X là "Tổng tiền"
showXAxisLabel = true;
xAxisLabel = 'Tổng tiền (VND)';

// Trục Y là tên sản phẩm
showYAxisLabel = true;
yAxisLabel = 'Sản phẩm';

// Định dạng trục X cho dễ đọc
yAxisTickFormatting = undefined; // Không cần định dạng bên trục Y vì chỉ hiển thị tên

xAxisTickFormatting = (value: number): string => {
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
      '#0aaf96', 
      '#0c9983', 
      '#0cc1a8', 
      '#087d6f', 
      '#1ed7bc', 
      '#0aaf96aa', 
    ]
  };
  formatRevenueData(data: { name: string; value: number; quantity: number }[]) {
    return data.map(item => ({
      name: `${item.name}\nSố lượng: ${item.quantity} cái\nTổng: ${this.formatCurrency(item.value)}`,
      value: item.value
    }));
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    });
  }

}

