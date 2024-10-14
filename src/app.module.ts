import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TenantMiddleware } from './tenant.middleware';  // Import your tenant middleware
import { MongooseModule } from '@nestjs/mongoose';
import { GrantsModule } from './grants/grants.module';   // Import GrantsModule
import { AuthModule } from './auth/auth.module';  // Import AuthModule

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),  // Auto-generate GraphQL schema
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/VeeGrantDB'),  // Correct MongoDB connection
    GrantsModule,  // Import GrantsModule
    AuthModule,    // Import AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],  // Only include AppService in providers
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');  // Apply TenantMiddleware globally
  }
}
