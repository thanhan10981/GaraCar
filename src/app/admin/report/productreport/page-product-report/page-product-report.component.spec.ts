import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageProductReportComponent } from './page-product-report.component';

describe('PageProductReportComponent', () => {
  let component: PageProductReportComponent;
  let fixture: ComponentFixture<PageProductReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageProductReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageProductReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
