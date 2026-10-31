import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { provideTranslateTesting } from '../../../shared/testing/translate-testing.providers';

import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let auth: jasmine.SpyObj<Pick<AuthService, 'requestPasswordReset'>>;

  beforeEach(async () => {
    auth = jasmine.createSpyObj<Pick<AuthService, 'requestPasswordReset'>>(
      'AuthService',
      ['requestPasswordReset'],
    );
    auth.requestPasswordReset.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideTranslateTesting(),
        { provide: AuthService, useValue: auth },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requests a password reset for a valid email and shows completion', () => {
    component.form.controls.email.setValue('person@example.com');

    component.submit();

    expect(auth.requestPasswordReset).toHaveBeenCalledWith('person@example.com');
    expect(component.done()).toBeTrue();
  });

  it('does not request a password reset when the email is invalid', () => {
    component.form.controls.email.setValue('not-an-email');

    component.submit();

    expect(auth.requestPasswordReset).not.toHaveBeenCalled();
    expect(component.done()).toBeFalse();
  });

  it('shows completion when the reset request fails to avoid disclosing accounts', () => {
    auth.requestPasswordReset.and.returnValue(
      throwError(() => new Error('Request failed')),
    );
    component.form.controls.email.setValue('person@example.com');

    component.submit();

    expect(component.done()).toBeTrue();
  });
});
