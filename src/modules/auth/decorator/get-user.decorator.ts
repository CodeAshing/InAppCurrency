import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {

    const user = { id: 123, email: 'asharib@gmail.com' };
    // const request: Express.Request = ctx.switchToHttp().getRequest();
    // if (data) {
    //   return request.user[data];
    // }
    return user;
  },
);
