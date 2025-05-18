import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarProductReportComponent } from './sidebar-product-report.component';

describe('SidebarProductReportComponent', () => {
  let component: SidebarProductReportComponent;
  let fixture: ComponentFixture<SidebarProductReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarProductReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarProductReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
