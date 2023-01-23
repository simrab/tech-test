import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelItemComponent } from '@views/tel-checker/components/tel-item/tel-item.component';

describe('TelephoneItemComponent', () => {
  let component: TelItemComponent;
  let fixture: ComponentFixture<TelItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TelItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
