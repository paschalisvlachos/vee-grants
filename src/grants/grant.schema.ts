import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Grant extends Document {
  @Prop({ required: true })
  foundationName: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  tenantId: string;  // Tenant-specific field

  @Prop({ required: true })
  matchDate: Date;

  @Prop({ required: false })
  feedback?: string;

  @Prop({ required: false })
  grantName?: string;

  @Prop({ required: false })
  avgAmount?: number;

  @Prop({ required: false })
  deadline?: string;
}

export const GrantSchema = SchemaFactory.createForClass(Grant);
