import { ITokens } from 'src/tokens/tokens.interface';
import UserDto from '../dto/user.dto';

export interface IRefreshTokens {
  error: boolean;
  message: string;
  user: UserDto;
  tokens: ITokens;
}
