import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MemberInfoComponent } from './member-info.component';
import { provideComponentTesting } from '../../../shared/testing/component-testing.providers';

describe('MemberInfoComponent', () => {
  let component: MemberInfoComponent;
  let fixture: ComponentFixture<MemberInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberInfoComponent],
      providers: [
        ...provideComponentTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => 'owner' },
              queryParamMap: { get: () => null },
            },
          },
        },
      ],
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
