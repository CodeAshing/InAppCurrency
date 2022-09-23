import {
  ConsoleLogger,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private config: ConfigService) {}

  async signup(dto: AuthDto) {
    // Create the DynamoDB service object
    const dynamoDB = this.getDynamoDB();

    const getParams = {
      TableName: 'client',
      Key: { email: dto.email },
    };

    const user = await dynamoDB.get(getParams).promise();

    if (user?.Item) throw new ForbiddenException('Credentials taken');

    const { email, name }: AuthDto = dto;

    // generate the password hash
    const hash = await argon.hash(dto.password);

    const putParams = {
      TableName: 'client',
      Item: {
        email: email,
        hash: hash,
        name: name,
        wallet: Number(0),
      },
    };

    await dynamoDB.put(putParams).promise();

    return this.signToken(email);
  }
  async signin(dto: AuthDto) {
    // Create the DynamoDB service object
    const dynamoDB = this.getDynamoDB();

    const getParams = {
      TableName: 'client',
      Key: { email: dto.email },
    };

    const user = await dynamoDB.get(getParams).promise();

    // if user does not exist throw exception
    if (!user?.Item) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await argon.verify(user.Item.hash, dto.password);

    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.Item.email);
  }

  async signToken(email: string): Promise<{ access_token: string }> {
    const payload = {
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  getDynamoDB() {
    return new AWS.DynamoDB.DocumentClient({
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
      region: this.config.get('AWS_REGION'),
    });
  }
}
