import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from 'src/roles/role.guard';

export const Auth = (roles: string[]) =>
  applyDecorators(UseGuards(AuthGuard, RoleGuard(roles)));
