import { Component, ViewEncapsulation } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-cart',
  imports: [FooterComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CartComponent {

}
