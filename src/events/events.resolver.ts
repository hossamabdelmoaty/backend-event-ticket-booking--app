import {
  Args,
  ID,
  Int,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { PaginationInput } from '../common/dto/pagination.input';
import { PaginatedEventsResponse } from './dto/paginated-events.response';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => PaginatedEventsResponse, {
    description: 'Get paginated list of events',
  })
  async events(
    @Args('pagination', { nullable: true, description: 'Pagination options' })
    pagination?: PaginationInput,
  ): Promise<PaginatedEventsResponse> {
    return this.eventsService.findFiltered(undefined, pagination);
  }

  @Query(() => Event, {
    description: 'Get a single event by ID',
  })
  async event(
    @Args('id', { type: () => ID, description: 'Event unique identifier' })
    id: string,
  ): Promise<Event> {
    return this.eventsService.findById(id);
  }

  @Query(() => [Event], {
    description: 'Get upcoming events',
  })
  async upcomingEvents(
    @Args('limit', { type: () => Int, nullable: true, description: 'Number of events to return' })
    limit?: number,
  ): Promise<Event[]> {
    return this.eventsService.findUpcoming(limit);
  }

  @Query(() => [Event], {
    description: 'Get popular events',
  })
  async popularEvents(
    @Args('limit', { type: () => Int, nullable: true, description: 'Number of events to return' })
    limit?: number,
  ): Promise<Event[]> {
    return this.eventsService.findPopular(limit);
  }
} 