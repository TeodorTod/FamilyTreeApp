import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAchievementsComponent } from './member-achievements.component';
import { provideComponentTesting } from '../../../../shared/testing/component-testing.providers';

describe('MemberAchievementsComponent', () => {
  let component: MemberAchievementsComponent;
  let fixture: ComponentFixture<MemberAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberAchievementsComponent],
      providers: provideComponentTesting(),
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
