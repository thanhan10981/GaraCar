import { Component, ViewEncapsulation } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-home',
  imports: [FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {

}
