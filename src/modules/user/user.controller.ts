import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //Api for user data update
  @Patch()
  @HttpCode(HttpStatus.OK)
  editUser(@GetUser('email') userEmail: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userEmail, dto);
  }
}
