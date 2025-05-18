import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFinanceComponent } from './table-finance.component';

describe('TableFinanceComponent', () => {
  let component: TableFinanceComponent;
  let fixture: ComponentFixture<TableFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFinanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
