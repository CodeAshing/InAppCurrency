import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class UserService {
  constructor(private config: ConfigService) { }

  async editUser(email: string, dto: EditUserDto) {
    // Create the DynamoDB service object
    const dynamoDB = this.getDynamoDB();

    const putParams = {
      TableName: 'client',
      Key: { email: email },
      UpdateExpression: 'set #MyVariable = :x',
      // This expression is what updates the item attribute
      ExpressionAttributeNames: {
        '#MyVariable': 'name',
      },
      //create an Expression Attribute Value to pass in the expression above
      ExpressionAttributeValues: {
        ':x': dto.name,
      },
      ReturnValues: 'ALL_NEW',
    };

    const user = await dynamoDB.update(putParams).promise();

    delete user.Attributes.hash;

    return user.Attributes;
  }

  getDynamoDB() {
    return new AWS.DynamoDB.DocumentClient({
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
      region: this.config.get('AWS_REGION'),
    });
  }
}
