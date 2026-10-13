import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionPlansComponent } from './subscription-plans.component';
import { Router } from '@angular/router';
import { provideTranslateTesting } from '../../../../shared/testing/translate-testing.providers';
import { AccountService } from '../../../account/services/account.service';
import { of } from 'rxjs';

describe('SubscriptionPlansComponent', () => {
  let component: SubscriptionPlansComponent;
  let fixture: ComponentFixture<SubscriptionPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPlansComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine
              .createSpy('navigate')
              .and.returnValue(Promise.resolve(true)),
          },
        },
        { provide: AccountService, useValue: { getProfile: () => of(null) } },
        provideTranslateTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
