import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SUBSCRIPTION_PLAN } from '../shared/enums/subscription-plan.enum';
import { BillingService } from './billing.service';

describe('BillingService', () => {
  it('rejects checkout creation when Stripe is not configured', async () => {
    const config = { get: jest.fn(() => undefined) };
    const service = new BillingService(
      config as unknown as ConfigService,
      {} as UsersService,
    );

    await expect(
      service.createCheckoutSession({
        plan: SUBSCRIPTION_PLAN.SIX_MONTHS,
        userId: 'user-id',
        customerEmail: 'person@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      }),
    ).rejects.toThrow(ServiceUnavailableException);
  });

  it('rejects webhook processing when Stripe is not configured', async () => {
    const config = { get: jest.fn(() => undefined) };
    const service = new BillingService(
      config as unknown as ConfigService,
      {} as UsersService,
    );

    await expect(
      service.handleWebhook(Buffer.from('{}'), 'signature'),
    ).rejects.toThrow(ServiceUnavailableException);
  });

  it('fails startup when an enabled Stripe plan price is missing', () => {
    const config = {
      get: jest.fn((key: string) =>
        key === 'STRIPE_SECRET_KEY' ? 'sk_test_placeholder' : undefined,
      ),
    };

    expect(
      () =>
        new BillingService(
          config as unknown as ConfigService,
          {} as UsersService,
        ),
    ).toThrow('Stripe price is not configured for plan SIX_MONTHS');
  });
});
