import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class DisplayService {
  private displayTypeSource = new BehaviorSubject<string>('chart');
  currentDisplayType = this.displayTypeSource.asObservable();

  updateDisplayType(type: string) {
    this.displayTypeSource.next(type);
  }
}
