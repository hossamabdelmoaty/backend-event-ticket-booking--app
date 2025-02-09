import { Field, ObjectType } from '@nestjs/graphql';
import { UserResponse } from './user.response';
import { Booking } from '../../bookings/entities/booking.entity';

@ObjectType()
export class UserWithBookingsResponse extends UserResponse {
  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];
} 