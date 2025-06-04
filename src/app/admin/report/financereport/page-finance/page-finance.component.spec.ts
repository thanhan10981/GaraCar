import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFinanceComponent } from './page-finance.component';

describe('PageFinanceComponent', () => {
  let component: PageFinanceComponent;
  let fixture: ComponentFixture<PageFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageFinanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
