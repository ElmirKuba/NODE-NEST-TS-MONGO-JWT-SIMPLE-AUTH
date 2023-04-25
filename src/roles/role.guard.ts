import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export const RoleGuard = (roles: string[]) => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      let hasRole = false;

      context['userData'].roles.forEach((role) => {
        if (roles.includes(role)) hasRole = true;
      });

      if (!hasRole) {
        throw new BadRequestException(
          `У пользователя нет доступа к ролям, ограниченным для ${roles.join(
            ', ',
          )}`,
        );
      }

      return true;
    }
  }

  const guard = mixin(RoleGuardMixin);
  return guard;
};
