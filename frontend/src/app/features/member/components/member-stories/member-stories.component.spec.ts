import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberStoriesComponent } from './member-stories.component';
import { provideComponentTesting } from '../../../../shared/testing/component-testing.providers';

describe('MemberStoriesComponent', () => {
  let component: MemberStoriesComponent;
  let fixture: ComponentFixture<MemberStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberStoriesComponent],
      providers: provideComponentTesting(),
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
