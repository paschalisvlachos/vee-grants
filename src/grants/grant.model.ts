import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Grant {
  @Field(() => ID, { nullable: true })  // Mark ID as nullable if needed
  id: string;

  @Field({ nullable: true })  // Allow foundationName to be nullable
  foundationName: string;

  @Field({ nullable: true })  // Allow grantName to be nullable
  grantName: string;

  @Field(() => Number, { nullable: true })  // Nullable average amount
  avgAmount: number;

  @Field({ nullable: true })  // Nullable status
  status: string;

  @Field({ nullable: true })  // Nullable deadline
  deadline: string;

  @Field({ nullable: true })  // Nullable matchDate
  matchDate: string;

  @Field({ nullable: true })  // Tenant ID, only if needed in the API
  tenantId?: string;  // Add tenantId if you want it exposed in the API

  @Field({ nullable: true })  // Add feedback if you want it exposed in the API
  feedback?: string;
}
