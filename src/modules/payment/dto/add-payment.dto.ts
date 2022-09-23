import { Min, IsNumber } from 'class-validator';

export class AddPaymentDto {
  @IsNumber()
  @Min(1)
  wallet?: number;
}
