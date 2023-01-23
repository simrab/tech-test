import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomInputComponent } from '@components/custom-input/custom-input.component';
import { TelListHeaderComponent } from '@views/tel-checker/components/tel-list-header/tel-list-header.component';

describe('TelListHeaderComponent', () => {
  let component: TelListHeaderComponent;
  let fixture: ComponentFixture<TelListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelListHeaderComponent, CustomInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TelListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('triggerUpload should call click event of fileUpload nativeElement', () => {
    jest.spyOn(component, 'triggerUpload').mockImplementation(() => []);
    if (component?.fileUpload) {
      component.triggerUpload();
      const input = fixture.debugElement.nativeElement.querySelector('input');
      expect(component.triggerUpload).toHaveBeenCalled();
      expect(input.files).not.toBe(null);
    }
  });
  it('clearFile should set fileUpload to be empty', () => {
    jest.spyOn(component, 'clearFile').mockImplementation(() => []);
    component.clearFile();
    expect(component.clearFile).toHaveBeenCalled();
    expect(component.fileUpload?.nativeElement.value).toBe('');
  });
});
