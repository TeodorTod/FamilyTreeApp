import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

type AdminRequest = {
  user?: {
    isAdmin?: boolean;
  };
};

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AdminRequest>();
    const user = request?.user;
    if (!user || user.isAdmin !== true) {
      throw new ForbiddenException('Admin privileges required');
    }
    return true;
  }
}
