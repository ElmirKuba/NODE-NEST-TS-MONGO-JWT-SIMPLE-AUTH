import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Auth(['role_user'])
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }
}
