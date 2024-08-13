import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlypurchaseComponent } from './monthlypurchase.component';

describe('MonthlypurchaseComponent', () => {
  let component: MonthlypurchaseComponent;
  let fixture: ComponentFixture<MonthlypurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlypurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlypurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
