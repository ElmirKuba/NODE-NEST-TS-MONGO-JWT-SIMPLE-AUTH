import { Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import environment from 'src/environments/environment';

import UserDto from 'src/auth/dto/user.dto';

import { ITokens } from './tokens.interface';

import { Token, TokenDocument } from './token.model';
import { ValidateRefreshToken } from './interfaces/validate-refresh-token.interface';
import { ValidateAccessToken } from './interfaces/validate-access-token.interface';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async removeRefreshToken(refreshToken: string) {
    return await this.tokenModel.deleteOne({ refreshToken });
  }

  async saveRefreshToken(
    userId: mongoose.Types.ObjectId,
    refreshToken: string,
  ) {
    const tokenData = await this.tokenModel.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;

      await tokenData.save();

      return tokenData;
    }

    const token = new this.tokenModel({
      user: userId,
      refreshToken,
    });

    await token.save();

    return token;
  }

  generateNewPairTokens(payload: UserDto): ITokens {
    const accessToken: string = this.generateAccessToken(payload);
    const refreshToken: string = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  generateAccessToken(payload: UserDto): string {
    return jsonwebtoken.sign(payload, environment.ACCESS_KEY_JWT, {
      expiresIn: '1d',
    });
  }

  generateRefreshToken(payload: UserDto): string {
    return jsonwebtoken.sign(payload, environment.REFRESH_KEY_JWT, {
      expiresIn: '30d',
    });
  }

  validateRefreshToken(refreshToken: string): ValidateRefreshToken {
    return jsonwebtoken.verify(
      refreshToken,
      environment.REFRESH_KEY_JWT,
    ) as ValidateRefreshToken;
  }

  validateAccessToken(accessToken: string): ValidateAccessToken {
    return jsonwebtoken.verify(
      accessToken,
      environment.ACCESS_KEY_JWT,
    ) as ValidateAccessToken;
  }

  async findRefreshToken(refreshToken: string) {
    return await this.tokenModel.findOne({ refreshToken });
  }
}
