import { Field, Int, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsDate, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class EventsFilterInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field(() => String, { nullable: true })
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
  @IsInt()
  @Min(0)
  minAvailableTickets?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  hasAvailableTickets?: boolean;
} 