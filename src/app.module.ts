import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TenantMiddleware } from './tenant.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { GrantsModule } from './grants/grants.module';   
import { AuthModule } from './auth/auth.module'; 
import * as dotenv from 'dotenv';

dotenv.config();

console.log('Connecting to MongoDB at:', process.env.MONGO_URI);

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), 
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    GrantsModule, 
    AuthModule,    
  ],
  controllers: [AppController],
  providers: [AppService],  // Only include AppService in providers
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');  // Apply TenantMiddleware globally
  }
}
