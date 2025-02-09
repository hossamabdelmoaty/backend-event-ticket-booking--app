import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsEmail } from 'class-validator';

@InputType()
export class UserFilterInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;
} 