import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { Grant, GrantSchema } from '../grants/grant.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/VeeGrantDB'), // Add Mongoose connection here
    MongooseModule.forFeature([{ name: Grant.name, schema: GrantSchema }]), // Register the Grant schema
  ],
  providers: [SeedService],
})
export class SeedModule {}
