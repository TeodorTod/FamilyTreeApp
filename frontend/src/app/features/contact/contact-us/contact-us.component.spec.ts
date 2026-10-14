import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsComponent } from './contact-us.component';
import { provideMessageTesting } from '../../../shared/testing/message-testing.providers';

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsComponent],
      providers: [provideMessageTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
