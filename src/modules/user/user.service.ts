import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor() {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = { id: 123, email: 'asharib@gmail.com' };

    return user;
  }
}
