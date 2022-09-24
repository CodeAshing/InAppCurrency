import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class UserService {
  constructor(private config: ConfigService) {}

  async editUser(email: string, dto: EditUserDto) {
    // Create the DynamoDB service object
    const dynamoDB = this.getDynamoDB();

    //set params
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

    //Update DynamoDB
    const user = await dynamoDB.update(putParams).promise();

    //Remove hash because its secret
    delete user.Attributes.hash;

    return user.Attributes;
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
