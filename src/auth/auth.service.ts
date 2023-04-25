import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from 'src/users/user.schema';
import { Role, RoleDocument } from 'src/roles/role.schema';

import { RegisterUserDto } from './dto/register-user.dto';
import UserDto from './dto/user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { TokensService } from 'src/tokens/tokens.service';

import { ITokens } from 'src/tokens/tokens.interface';
import { IAuth } from './interfaces/auth.interface';
import { ILogout } from './interfaces/logout.interface';
import { IRefreshTokens } from './interfaces/refresh-tokens.interface';
import { ValidateRefreshToken } from 'src/tokens/interfaces/validate-refresh-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private tokenService: TokensService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<IAuth> {
    const candidate = await this.userModel.collection.findOne({
      username: registerUserDto.username,
    });

    if (candidate) {
      throw new BadRequestException(
        `Пользователь с логином ${registerUserDto.username} уже существует.`,
      );
    }

    const userRole = await this.roleModel.collection.findOne({
      value: 'role_user',
    });

    const hashPassword: string = await bcrypt.hash(registerUserDto.password, 7);

    const user = new this.userModel({
      username: registerUserDto.username,
      password: hashPassword,
      roles: [userRole.value],
    });

    await user.save();

    const userDto: UserDto = new UserDto(user);

    const tokens: ITokens = this.tokenService.generateNewPairTokens({
      ...userDto,
    });

    await this.tokenService.saveRefreshToken(user._id, tokens.refreshToken);

    return {
      error: false,
      message: 'User registered successfully',
      user: userDto,
      tokens,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<IAuth> {
    const user = await this.userModel.collection.findOne({
      username: loginUserDto.username,
    });

    if (!user) {
      throw new BadRequestException(
        `Пользователь с логином ${loginUserDto.username} не существует.`,
      );
    }

    const validPassword: boolean = bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new BadRequestException(
        `Пароль от аккаунта ${loginUserDto.username} введен неверно.`,
      );
    }

    const userDto: UserDto = new UserDto(user as UserDocument);

    const tokens: ITokens = this.tokenService.generateNewPairTokens({
      ...userDto,
    });

    await this.tokenService.saveRefreshToken(
      user._id as mongoose.Types.ObjectId,
      tokens.refreshToken,
    );

    return {
      error: false,
      message: 'User authorization successfully',
      user: userDto,
      tokens,
    };
  }

  async logout(refreshToken: string): Promise<ILogout> {
    return {
      token: await this.tokenService.removeRefreshToken(refreshToken),
      message: 'Выход из аккаунта произведен успешно',
      error: false,
    };
  }

  async refreshTokens(refreshToken: string): Promise<IRefreshTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const userData: ValidateRefreshToken =
      this.tokenService.validateRefreshToken(refreshToken);
    const dataFromDb = await this.tokenService.findRefreshToken(refreshToken);

    if (!userData || !dataFromDb) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const user = await this.userModel.findById(userData.id);

    const userDto: UserDto = new UserDto(user);

    const tokens: ITokens = this.tokenService.generateNewPairTokens({
      ...userDto,
    });

    await this.tokenService.saveRefreshToken(
      user._id as mongoose.Types.ObjectId,
      tokens.refreshToken,
    );

    return {
      error: false,
      message: 'Новая пара access & refresh токенов получена успешно',
      user: userDto,
      tokens,
    };
  }
}
