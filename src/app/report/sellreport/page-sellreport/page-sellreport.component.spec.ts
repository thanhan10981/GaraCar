import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSellreportComponent } from './page-sellreport.component';

describe('PageSellreportComponent', () => {
  let component: PageSellreportComponent;
  let fixture: ComponentFixture<PageSellreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSellreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSellreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
