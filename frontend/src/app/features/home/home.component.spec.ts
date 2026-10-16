import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { provideTranslateTesting } from '../../shared/testing/translate-testing.providers';
import { provideMessageTesting } from '../../shared/testing/message-testing.providers';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideTranslateTesting(),
        provideMessageTesting(),
        { provide: ConfirmationService, useValue: { confirm: () => void 0 } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: { get: () => null },
              url: [{ path: 'chart', parameters: {} }],
            },
            parent: {
              snapshot: {
                url: [],
                params: {},
                queryParamMap: { get: () => null },
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
