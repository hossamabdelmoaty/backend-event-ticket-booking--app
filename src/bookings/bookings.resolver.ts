import { Args, ID, Query, Resolver, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { Booking } from './entities/booking.entity';
import { BookingsService } from './bookings.service';
import { User } from '../users/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { BookingFilterInput } from './dto/booking-filter.input';
import { PaginationInput } from '../common/dto/pagination.input';
import { PaginatedBookingsResponse } from './dto/paginated-bookings.response';
import { CreateBookingInput } from './dto/create-booking.input';

@Resolver(() => Booking)
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Query(() => Booking, {
    name: 'booking',
    description: 'Get a single booking by ID'
  })
  async getBooking(
    @Args('id', { type: () => ID }) id: string
  ): Promise<Booking> {
    return this.bookingsService.findById(id);
  }

  @Query(() => PaginatedBookingsResponse, {
    name: 'bookings',
    description: 'Get all bookings with optional filtering and pagination'
  })
  async getBookings(
    @Args('filter', { nullable: true }) filter?: BookingFilterInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PaginatedBookingsResponse> {
    return this.bookingsService.findFiltered(filter, pagination);
  }

  @ResolveField(() => User)
  async user(@Parent() booking: Booking): Promise<User> {
    return this.bookingsService.getUser(booking.userId);
  }

  @ResolveField(() => Event)
  async event(@Parent() booking: Booking): Promise<Event> {
    return this.bookingsService.getEvent(booking.eventId);
  }

  @Mutation(() => Booking)
  async createBooking(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('input') input: CreateBookingInput,
  ): Promise<Booking> {
    return this.bookingsService.createBooking(userId, input);
  }
} 