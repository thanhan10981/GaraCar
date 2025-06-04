import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFinanceComponent } from './sidebar-finance.component';

describe('SidebarFinanceComponent', () => {
  let component: SidebarFinanceComponent;
  let fixture: ComponentFixture<SidebarFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarFinanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
