import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelativeDialogComponent } from './add-relative-dialog.component';
import { provideComponentTesting } from '../../testing/component-testing.providers';

describe('AddRelativeDialogComponent', () => {
  let component: AddRelativeDialogComponent;
  let fixture: ComponentFixture<AddRelativeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRelativeDialogComponent],
      providers: provideComponentTesting(),
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRelativeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
