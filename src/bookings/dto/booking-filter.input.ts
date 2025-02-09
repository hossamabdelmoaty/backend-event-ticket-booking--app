import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class BookingFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdTo?: Date;
} 