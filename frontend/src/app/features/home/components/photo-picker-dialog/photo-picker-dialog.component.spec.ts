import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoPickerDialogComponent } from './photo-picker-dialog.component';
import { provideComponentTesting } from '../../../../shared/testing/component-testing.providers';

describe('PhotoPickerDialogComponent', () => {
  let component: PhotoPickerDialogComponent;
  let fixture: ComponentFixture<PhotoPickerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoPickerDialogComponent],
      providers: provideComponentTesting(),
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoPickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits selected photo and closes when saved', () => {
    const photo = component.availablePhotos[0];
    spyOn(component.photoSelected, 'emit');
    spyOn(component.close, 'emit');

    component.selectPhoto(photo);
    component.save();

    expect(component.photoSelected.emit).toHaveBeenCalledWith(photo);
    expect(component.close.emit).toHaveBeenCalled();
  });
});
