import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSellComponent } from './chart-sell.component';

describe('ChartSellComponent', () => {
  let component: ChartSellComponent;
  let fixture: ComponentFixture<ChartSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartSellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
