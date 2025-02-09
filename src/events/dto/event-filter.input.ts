import { Field, InputType, Int, Float } from '@nestjs/graphql';
import { IsOptional, IsString, IsDate, Min, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class EventFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTo?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  minAvailableTickets?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  hasAvailableTickets?: boolean;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
} 