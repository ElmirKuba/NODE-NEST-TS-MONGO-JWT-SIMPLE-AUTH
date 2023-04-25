import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { IAuth } from './interfaces/auth.interface';

import { AuthService } from './auth.service';
import { ILogout } from './interfaces/logout.interface';
import { IRefreshTokens } from './interfaces/refresh-tokens.interface';

@Controller('auth')
export class AuthController {
  private _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res() response: Response,
  ) {
    const data: IAuth = await this._authService.register(registerUserDto);

    return response
      .status(201)
      .cookie('refreshToken', data.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json(data);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    const data: IAuth = await this._authService.login(loginUserDto);

    return response
      .status(201)
      .cookie('refreshToken', data.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json(data);
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const { refreshToken } = request.cookies;

    const data: ILogout = await this._authService.logout(refreshToken);

    response.clearCookie('refreshToken');

    return response.status(200).json(data);
  }

  @Get('refresh-tokens')
  async refreshTokens(@Req() request: Request, @Res() response: Response) {
    const { refreshToken } = request.cookies;

    const data: IRefreshTokens = await this._authService.refreshTokens(
      refreshToken,
    );

    response.cookie('refreshToken', data.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    response.status(201).json(data);
  }
}
