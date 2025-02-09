import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Booking } from '../entities/booking.entity';

@ObjectType()
export class PaginatedBookingsResponse {
  @Field(() => [Booking])
  items!: Booking[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;
} 