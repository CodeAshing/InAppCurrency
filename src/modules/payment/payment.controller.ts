import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { AddPaymentDto, TransferPaymentDto } from './dto';
import { PaymentService } from './payment.service';

@UseGuards(JwtGuard)
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  //Api for adding amount in wallet
  @HttpCode(HttpStatus.OK)
  @Post('add')
  addPayment(
    @GetUser('email') paymentEmail: string,
    @Body() dto: AddPaymentDto,
  ) {
    return this.paymentService.addPayment(paymentEmail, dto);
  }

  //Api for transfer amount to other client
  @HttpCode(HttpStatus.OK)
  @Post('transfer')
  transferPayment(
    @GetUser('email') paymentEmail: string,
    @Body() dto: TransferPaymentDto,
  ) {
    return this.paymentService.transferPayment(paymentEmail, dto);
  }
}
