import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelItemComponent } from '@views/tel-checker/components/tel-item/tel-item.component';

import { CustomListComponent } from './custom-list.component';

describe('CustomListComponent', () => {
  let component: CustomListComponent;
  let fixture: ComponentFixture<CustomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomListComponent, TelItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
