import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrantsService } from './grants.service';
import { GrantsResolver } from './grants.resolver';
import { Grant, GrantSchema } from './grant.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Grant', schema: GrantSchema }]),
  ],
  providers: [GrantsService, GrantsResolver],
  exports: [GrantsService],
})
export class GrantsModule {}
