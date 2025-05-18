import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarProviderComponent } from './sidebar-provider.component';

describe('SidebarProviderComponent', () => {
  let component: SidebarProviderComponent;
  let fixture: ComponentFixture<SidebarProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
