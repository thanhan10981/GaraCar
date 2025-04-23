import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showColorPicker = false;
  selectedColor = '#1B1E2C';
  colors = [
    '#007bff', '#4b6584', '#2ecc71',
    '#9b59b6', '#e74c3c', '#7f8c8d',
    '#16a085', '#e67e22', '#d63384'
  ];

  toggleColorPicker() {
    this.showColorPicker = !this.showColorPicker;
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

}
