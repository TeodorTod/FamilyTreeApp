import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AccountSettingsComponent } from './account-settings.component';
import { AccountService } from '../services/account.service';
import { LanguageService } from '../../../../assets/i18n/language.service';
import { provideTranslateTesting } from '../../../shared/testing/translate-testing.providers';
import { AuthService } from '../../auth/services/auth.service';
import { FamilyService } from '../../../core/services/family.service';
import { Router } from '@angular/router';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  let accountStub: jasmine.SpyObj<AccountService>;
  const profile = {
    id: 'user-1',
    email: 'test@example.com',
    createdAt: new Date().toISOString(),
    language: 'en' as const,
  };

  beforeEach(async () => {
    accountStub = jasmine.createSpyObj<AccountService>('AccountService', [
      'getProfile',
      'updateProfile',
      'updateLanguage',
      'changePassword',
    ]);
    accountStub.getProfile.and.returnValue(of(profile));
    accountStub.updateProfile.and.returnValue(of(profile));
    accountStub.updateLanguage.and.returnValue(of({ language: 'en' }));
    accountStub.changePassword.and.returnValue(of({ ok: true }));

    await TestBed.configureTestingModule({
      imports: [AccountSettingsComponent],
      providers: [
        { provide: AccountService, useValue: accountStub },
        {
          provide: LanguageService,
          useValue: { current: () => 'en', use: () => void 0 },
        },
        { provide: AuthService, useValue: { refreshProfile: () => void 0 } },
        { provide: FamilyService, useValue: { getFamilyMemberByRole: () => of(null) } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        provideTranslateTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
