import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

@InputType()
export class SubmitFeedbackInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Feedback cannot be empty' })
  feedback: string;

  @Field()
  @IsBoolean()
  approve: boolean;
}
