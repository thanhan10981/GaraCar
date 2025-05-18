import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart-product',
  imports: [CommonModule,NgxChartsModule],
  templateUrl: './chart-product.component.html',
  styleUrl: './chart-product.component.css'
})
export class ChartProductComponent {
view: [number, number] = [800, 400];

  data = [
    { name: 'Seden', value: 10500 },
    { name: 'MWC', value: 7200 },
    { name: 'MPV', value: 15000 },
    { name: 'SUV', value: 8600 },
  ];

  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;

  xAxisLabel = 'Doanh thu';
  yAxisLabel = 'Sản phẩm';

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099']
  };

  yAxisTickFormatting = (value: number): string => {
    if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return value.toString();
  };
}
