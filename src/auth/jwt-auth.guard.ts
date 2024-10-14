import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.log('No valid token, blocking access');  // Ensure the guard blocks access
      throw new UnauthorizedException('You are not authorized to access this resource');
    }
    console.log('User is authorized:', user);  // Log for successful authorization
    return user;
  }
}
