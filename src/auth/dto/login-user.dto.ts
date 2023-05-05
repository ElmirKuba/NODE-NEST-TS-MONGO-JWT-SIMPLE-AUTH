import { IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @Length(3, 30, {
    message: `Имя пользователя должно быть от 3 до 30 символов (включительно)`,
  })
  username: string;

  @IsString()
  @Length(3, 30, {
    message: `Пароль должен быть от 3 до 30 символов (включительно)`,
  })
  password: string;
}
