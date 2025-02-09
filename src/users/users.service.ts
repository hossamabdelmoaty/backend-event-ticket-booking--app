import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserFilterInput } from './dto/user-filter.input';
import { PaginationInput } from '../common/dto/pagination.input';
import { PaginatedUsersResponse } from './dto/paginated-users.response';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findFiltered(
    filter?: UserFilterInput,
    pagination?: PaginationInput,
  ): Promise<PaginatedUsersResponse> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const query = this.repository.createQueryBuilder('user');

    if (filter) {
      if (filter.username) {
        query.andWhere('user.username ILIKE :username', {
          username: `%${filter.username}%`,
        });
      }
      if (filter.email) {
        query.andWhere('user.email ILIKE :email', {
          email: `%${filter.email}%`,
        });
      }
    }

    const total = await query.getCount();

    query
      .leftJoinAndSelect('user.bookings', 'bookings')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC');

    const items = await query.getMany();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['bookings'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getBookings(userId: string) {
    const user = await this.findById(userId);
    return user.bookings || [];
  }
} 