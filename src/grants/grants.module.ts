import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrantsService } from './grants.service';
import { GrantsResolver } from './grants.resolver';
import { Grant, GrantSchema } from './grant.schema';  // Import the correct Mongoose schema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Grant', schema: GrantSchema }]),  // Use the correct model name
  ],
  providers: [GrantsService, GrantsResolver],
  exports: [GrantsService],
})
export class GrantsModule {}
