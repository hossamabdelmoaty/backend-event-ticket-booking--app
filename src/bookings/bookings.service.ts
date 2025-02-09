import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { BookingFilterInput } from './dto/booking-filter.input';
import { PaginationInput } from '../common/dto/pagination.input';
import { PaginatedBookingsResponse } from './dto/paginated-bookings.response';
import { CreateBookingInput } from './dto/create-booking.input';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly dataSource: DataSource,
  ) {}

  async findFiltered(
    filter?: BookingFilterInput,
    pagination?: PaginationInput,
  ): Promise<PaginatedBookingsResponse> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const query = this.repository.createQueryBuilder('booking');

    if (filter) {
      if (filter.userId) {
        query.andWhere('booking.userId = :userId', { userId: filter.userId });
      }
      if (filter.eventId) {
        query.andWhere('booking.eventId = :eventId', { eventId: filter.eventId });
      }
      if (filter.createdFrom) {
        query.andWhere('booking.createdAt >= :createdFrom', {
          createdFrom: filter.createdFrom,
        });
      }
      if (filter.createdTo) {
        query.andWhere('booking.createdAt <= :createdTo', {
          createdTo: filter.createdTo,
        });
      }
    }

    const total = await query.getCount();

    query
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.event', 'event')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('booking.createdAt', 'DESC');

    const items = await query.getMany();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.repository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async findAll(): Promise<Booking[]> {
    try {
      return await this.repository.find({
        relations: ['user', 'event'],
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      this.logger.error('Failed to fetch bookings:', error);
      throw error;
    }
  }

  async getUser(userId: string) {
    return this.usersService.findById(userId);
  }

  async getEvent(eventId: string) {
    return this.eventsService.findById(eventId);
  }

  async createBooking(userId: string, input: CreateBookingInput): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ');

    try {
      // Verify user exists
      await this.usersService.findById(userId);

      // Get event and check availability
      const event = await queryRunner.manager
        .createQueryBuilder()
        .select('event')
        .from('events', 'event')
        .where('id = :id', { id: input.eventId })
        .setLock('pessimistic_write')
        .getOne();

      if (!event) {
        throw new NotFoundException(`Event with ID ${input.eventId} not found`);
      }

      if (event.availableTickets < input.numberOfTickets) {
        throw new ConflictException(
          `Not enough tickets available. Requested: ${input.numberOfTickets}, Available: ${event.availableTickets}`,
        );
      }

      // Update event's available tickets
      event.availableTickets -= input.numberOfTickets;
      await queryRunner.manager.save(event);

      // Create booking
      const booking = this.repository.create({
        userId,
        eventId: input.eventId,
        numberOfTickets: input.numberOfTickets,
      });

      const savedBooking = await queryRunner.manager.save(booking);
      await queryRunner.commitTransaction();

      return savedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to create booking:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
} 