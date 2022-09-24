import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as AWS from 'aws-sdk';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { email: string; name: string }) {
    // Create the DynamoDB service object
    const dynamoDB = this.getDynamoDB();

    //Fetch data
    const getParams = {
      TableName: 'client',
      Key: { email: payload.email },
    };

    //set params
    const user = await dynamoDB.get(getParams).promise();

    // if user does not exist throw exception
    if (!user?.Item) throw new UnauthorizedException();
    //Remove hash because its secret
    delete user.Item.hash;

    return user.Item;
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
