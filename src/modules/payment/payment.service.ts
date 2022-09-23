import { Injectable } from '@nestjs/common';
import { AddPaymentDto } from './dto';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class PaymentService {
  constructor(private config: ConfigService) { }

  async addPayment(email: string, dto: AddPaymentDto) {
    // Create the DynamoDB service object
    const dynamoDB = this.getDynamoDB();

    console.log(dto, 'dto');

    const putParams = {
      TableName: 'client',
      Key: { email: email },
      UpdateExpression: 'ADD wallet :increase',
      ExpressionAttributeValues: {
        ':increase': Number(2)
      },
    };

    // UpdateExpression = 'SET #usage = #usage + :increase',

    const payment = await dynamoDB.update(putParams).promise();

    delete payment.Attributes.hash;

    return payment.Attributes;
  }

  getDynamoDB() {
    return new AWS.DynamoDB.DocumentClient({
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
      region: this.config.get('AWS_REGION'),
    });
  }
}
