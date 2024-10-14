import { Catch, ArgumentsHost, UnauthorizedException, ExceptionFilter } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch(UnauthorizedException)
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    console.log('Caught UnauthorizedException in filter');  // Ensure this is logged

    // Return proper GraphQL error without any data
    return {
      errors: [
        {
          message: exception.message || 'Unauthorized',
          extensions: {
            code: 'UNAUTHENTICATED',
            statusCode: 401,
          },
        },
      ],
      data: null,  // Ensure no data is returned
    };
  }
}
