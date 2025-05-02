import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDailyReportComponent } from './table-daily-report.component';

describe('TableDailyReportComponent', () => {
  let component: TableDailyReportComponent;
  let fixture: ComponentFixture<TableDailyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDailyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
