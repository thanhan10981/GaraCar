import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDailyReportComponent } from './sidebar-daily-report.component';

describe('SidebarDailyReportComponent', () => {
  let component: SidebarDailyReportComponent;
  let fixture: ComponentFixture<SidebarDailyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarDailyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
