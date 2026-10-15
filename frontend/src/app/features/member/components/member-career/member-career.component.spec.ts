import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCareerComponent } from './member-career.component';
import { provideComponentTesting } from '../../../../shared/testing/component-testing.providers';

describe('MemberCareerComponent', () => {
  let component: MemberCareerComponent;
  let fixture: ComponentFixture<MemberCareerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberCareerComponent],
      providers: provideComponentTesting(),
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberCareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
