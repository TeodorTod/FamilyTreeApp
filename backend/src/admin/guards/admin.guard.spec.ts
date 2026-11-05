import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

type AdminUser = { isAdmin?: boolean };

function contextFor(user?: AdminUser): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('AdminGuard', () => {
  const guard = new AdminGuard();

  it('allows an administrator', () => {
    expect(guard.canActivate(contextFor({ isAdmin: true }))).toBe(true);
  });

  it('rejects a missing or non-administrator user', () => {
    expect(() => guard.canActivate(contextFor())).toThrow(ForbiddenException);
    expect(() => guard.canActivate(contextFor({ isAdmin: false }))).toThrow(
      ForbiddenException,
    );
  });
});
