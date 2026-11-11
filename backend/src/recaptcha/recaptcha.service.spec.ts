import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecaptchaService } from './recaptcha.service';

describe('RecaptchaService', () => {
  it('rejects a missing token when verification is configured', async () => {
    const config = {
      get: jest.fn((key: string) =>
        key === 'RECAPTCHA_SECRET_KEY' ? 'secret' : 0.5,
      ),
    };
    const service = new RecaptchaService(config as unknown as ConfigService);

    await expect(service.verify(undefined, 'login')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('bypasses verification when no secret is configured', async () => {
    const config = { get: jest.fn(() => undefined) };
    const service = new RecaptchaService(config as unknown as ConfigService);

    await expect(service.verify(undefined, 'login')).resolves.toBeUndefined();
  });
});
