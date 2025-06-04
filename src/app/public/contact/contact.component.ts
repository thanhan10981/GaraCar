import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-contact',
  imports: [CommonModule, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ContactComponent {

}
