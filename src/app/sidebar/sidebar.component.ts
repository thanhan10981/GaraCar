import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [FormsModule],
})
export class SidebarComponent {
  filters = {
    status: {
      working: false,
      resigned: false,
    },
    department: '',
  };

  @Output() filtersChange = new EventEmitter<any>();

  emitFilters() {
    this.filtersChange.emit(this.filters);
  }
}
