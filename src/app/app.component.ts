import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { EmployeePageComponent } from "./employee-page/employee-page.component";

@Component({
  selector: 'app-root',
  imports: [EmployeePageComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GARACAR';
}
