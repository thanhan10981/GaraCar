import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {  CustomerComponent } from "./partner/customer/customer.component";
import { HeaderComponent } from "./header/header.component";


@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GARACAR';
}
