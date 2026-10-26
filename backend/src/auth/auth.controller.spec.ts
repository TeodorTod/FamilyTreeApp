import { Test, TestingModule } from '@nestjs/testing';
import { RecaptchaService } from '../recaptcha/recaptcha.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

const authService = {
  resetPasswordWithToken: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    authService.resetPasswordWithToken.mockReset();

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
});
