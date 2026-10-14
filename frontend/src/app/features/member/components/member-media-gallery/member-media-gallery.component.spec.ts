import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMediaGalleryComponent } from './member-media-gallery.component';
import { provideMessageTesting } from '../../../../shared/testing/message-testing.providers';

describe('MemberMediaGalleryComponent', () => {
  let component: MemberMediaGalleryComponent;
  let fixture: ComponentFixture<MemberMediaGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberMediaGalleryComponent],
      providers: [provideMessageTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberMediaGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
