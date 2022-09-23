import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Patch()
  editUser(@GetUser('email') userEmail: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userEmail, dto);
  }
}
