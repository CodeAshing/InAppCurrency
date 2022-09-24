import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddPaymentDto, TransferPaymentDto } from './dto';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class PaymentService {
  constructor(private config: ConfigService) {}

  async addPayment(email: string, dto: AddPaymentDto) {
    // Create the DynamoDB service object
    const dynamoDB = this.getDynamoDB();

    //set params
    const putParams = {
      TableName: 'client',
      Key: { email: email },
      UpdateExpression: 'ADD wallet :increase',
      ExpressionAttributeValues: {
        ':increase': Number(dto.wallet),
      },
      ReturnValues: 'ALL_NEW',
    };

    //Update DynamoDB
    const payment = await dynamoDB.update(putParams).promise();

    //Remove hash because its secret
    delete payment.Attributes.hash;

    return payment.Attributes;
  }

  async transferPayment(email: string, dto: TransferPaymentDto) {
    // Create the DynamoDB service object
    const dynamoDB = this.getDynamoDB();

    //set params
    const getParams = {
      TableName: 'client',
      Key: { email: dto.receiverEmail },
    };

    //Fetch data
    const user = await dynamoDB.get(getParams).promise();

    // if user does not exist throw exception
    if (!user?.Item) throw new NotFoundException('Receiver account not found');

    //set params for a client who is paying amount
    const deductionAmountParams = {
      TableName: 'client',
      Key: { email: email },
      UpdateExpression: 'set wallet = wallet -  :amount',
      ConditionExpression: 'wallet >= :amount',
      ExpressionAttributeValues: {
        ':amount': Number(dto.amount),
      },
      ReturnValues: 'ALL_NEW',
    };

    //set params for a client who is getting amount
    const additionAmountParams = {
      TableName: 'client',
      Key: { email: dto.receiverEmail },
      UpdateExpression: 'ADD wallet :increase',
      ExpressionAttributeValues: {
        ':increase': Number(dto.amount),
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      //apply transaction with ACID
      await dynamoDB
        .transactWrite({
          ReturnConsumedCapacity: 'INDEXES',
          ReturnItemCollectionMetrics: 'SIZE',

          TransactItems: [
            {
              Update: deductionAmountParams,
            },
            {
              Update: additionAmountParams,
            },
          ],
        })
        .promise();
    } catch (error) {
      // Throw exception if client wallet does not contain enough amount
      if (error['code'] === 'TransactionCanceledException')
        throw new ConflictException('Insufficient balance');

      throw error;
    }
  }

  //Config DynamoDB
  getDynamoDB() {
    return new AWS.DynamoDB.DocumentClient({
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
      region: this.config.get('AWS_REGION'),
    });
  }
}
