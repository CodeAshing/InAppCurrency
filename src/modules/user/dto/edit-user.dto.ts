import { IsEmail, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  name?: string;
}
