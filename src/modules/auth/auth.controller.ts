import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //Api for signing up
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  //Api for signing up
  @HttpCode(HttpStatus.OK)
  @Post('signing')
  signing(@Body() dto: AuthDto) {
    return this.authService.signing(dto);
  }
}
