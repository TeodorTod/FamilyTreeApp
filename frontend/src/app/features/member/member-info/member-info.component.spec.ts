import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInfoComponent } from './member-info.component';
import { provideMessageTesting } from '../../../shared/testing/message-testing.providers';

describe('MemberInfoComponent', () => {
  let component: MemberInfoComponent;
  let fixture: ComponentFixture<MemberInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberInfoComponent],
      providers: [provideMessageTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
