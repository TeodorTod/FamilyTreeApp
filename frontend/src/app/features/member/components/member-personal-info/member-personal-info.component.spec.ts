import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPersonalInfoComponent } from './member-personal-info.component';
import { provideComponentTesting } from '../../../../shared/testing/component-testing.providers';

describe('MemberPersonalInfoComponent', () => {
  let component: MemberPersonalInfoComponent;
  let fixture: ComponentFixture<MemberPersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberPersonalInfoComponent],
      providers: provideComponentTesting(),
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('role', 'owner');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
