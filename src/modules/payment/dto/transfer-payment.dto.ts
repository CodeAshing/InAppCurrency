import { Min, IsNumber, IsEmail, IsNotEmpty } from 'class-validator';

export class TransferPaymentDto {
  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;
}