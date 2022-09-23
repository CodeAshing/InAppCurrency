import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {  GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { AddPaymentDto } from './dto';
import { PaymentService } from './payment.service';

@UseGuards(JwtGuard)
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('add')
  addPayment(
    @GetUser('email') paymentEmail: string,
    @Body() dto: AddPaymentDto,
  ) {
    return this.paymentService.addPayment(paymentEmail, dto);
  }
}
