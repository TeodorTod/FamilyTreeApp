import { Test, TestingModule } from '@nestjs/testing';
import { RecaptchaService } from '../recaptcha/recaptcha.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

const authService = {
  changePassword: jest.fn(),
  resetPasswordWithToken: jest.fn(),
  updateUserLanguage: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    authService.changePassword.mockReset();
    authService.resetPasswordWithToken.mockReset();
    authService.updateUserLanguage.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: RecaptchaService, useValue: { verify: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('resetPassword', () => {
    it('rejects mismatched passwords without resetting the password', async () => {
      await expect(
        controller.resetPassword({
          token: 'reset-token',
          password: 'new-password',
          confirmPassword: 'different-password',
        }),
      ).rejects.toThrow('Passwords do not match');

      expect(authService.resetPasswordWithToken).not.toHaveBeenCalled();
    });

    it('resets the password when confirmation matches', async () => {
      await expect(
        controller.resetPassword({
          token: 'reset-token',
          password: 'new-password',
          confirmPassword: 'new-password',
        }),
      ).resolves.toEqual({ ok: true });

      expect(authService.resetPasswordWithToken).toHaveBeenCalledWith(
        'reset-token',
        'new-password',
      );
    });
  });

  describe('updateLanguage', () => {
    it('rejects unsupported language codes without changing the user', async () => {
      await expect(
        controller.updateLanguage({ user: { id: 'user-id' } }, 'de' as 'bg'),
      ).rejects.toThrow('Invalid language code');

      expect(authService.updateUserLanguage).not.toHaveBeenCalled();
    });

    it('updates and returns a supported language', async () => {
      authService.updateUserLanguage.mockResolvedValue({ language: 'bg' });

      await expect(
        controller.updateLanguage({ user: { id: 'user-id' } }, 'bg'),
      ).resolves.toEqual({ language: 'bg' });

      expect(authService.updateUserLanguage).toHaveBeenCalledWith('user-id', 'bg');
    });
  });

  describe('changePassword', () => {
    it('rejects mismatched passwords without changing the password', async () => {
      await expect(
        controller.changePassword(
          { user: { id: 'user-id', language: 'bg' } },
          {
            currentPassword: 'current-password',
            newPassword: 'new-password',
            confirmPassword: 'different-password',
          },
        ),
      ).rejects.toThrow('Passwords do not match');

      expect(authService.changePassword).not.toHaveBeenCalled();
    });

    it('uses English when the user has no supported language', async () => {
      await expect(
        controller.changePassword(
          { user: { id: 'user-id', language: 'de' } },
          {
            currentPassword: 'current-password',
            newPassword: 'new-password',
            confirmPassword: 'new-password',
          },
        ),
      ).resolves.toEqual({ ok: true });

      expect(authService.changePassword).toHaveBeenCalledWith(
        'user-id',
        'current-password',
        'new-password',
        'en',
      );
    });
  });
});
