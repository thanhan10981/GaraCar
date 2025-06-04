import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageProviderComponent } from './page-provider.component';

describe('PageProviderComponent', () => {
  let component: PageProviderComponent;
  let fixture: ComponentFixture<PageProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
