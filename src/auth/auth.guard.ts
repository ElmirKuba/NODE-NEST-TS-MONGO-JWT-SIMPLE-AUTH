import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { TokensService } from 'src/tokens/tokens.service';
import { ValidateAccessToken } from 'src/tokens/interfaces/validate-access-token.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokensService: TokensService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const authorizationHeader = request.headers.authorization?.split(' ');

    if (!authorizationHeader) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const authMethod = authorizationHeader[0];

    if (authMethod !== 'Bearer') {
      throw new UnauthorizedException(
        'Поддерживается авторизация только по Bearer JWT токену',
      );
    }

    const accessToken = authorizationHeader[1];

    if (!accessToken) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const userData: ValidateAccessToken =
      this.tokensService.validateAccessToken(accessToken);

    if (!userData) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    context['userData'] = userData;

    return true;
  }
}
