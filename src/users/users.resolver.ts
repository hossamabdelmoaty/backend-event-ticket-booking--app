import {
  Args,
  ID,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Booking } from '../bookings/entities/booking.entity';
import { UserFilterInput } from './dto/user-filter.input';
import { PaginationInput } from '../common/dto/pagination.input';
import { PaginatedUsersResponse } from './dto/paginated-users.response';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, {
    name: 'user',
    description: 'Get a single user by ID',
  })
  async getUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Query(() => PaginatedUsersResponse, {
    name: 'users',
    description: 'Get all users with optional filtering and pagination',
  })
  async getUsers(
    @Args('filter', { nullable: true }) filter?: UserFilterInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PaginatedUsersResponse> {
    return this.usersService.findFiltered(filter, pagination);
  }

  @ResolveField(() => [Booking])
  async bookings(@Parent() user: User): Promise<Booking[]> {
    return this.usersService.getBookings(user.id);
  }
} 