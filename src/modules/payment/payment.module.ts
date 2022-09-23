import { PaymentController } from './payment.controller';
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
