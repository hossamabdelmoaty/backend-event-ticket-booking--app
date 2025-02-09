import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventFilterInput } from './dto/event-filter.input';
import { PaginationInput } from '../common/dto/pagination.input';
import { EventsFilterInput } from './dto/events-filter.input';
import { PaginatedEventsResponse } from './dto/paginated-events.response';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  private readonly schema = process.env.DB_SCHEMA;

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  private setQuerySchema(query: any) {
    if (query.expressionMap?.mainAlias) {
      query.expressionMap.mainAlias.metadata.schema = this.schema;
    }
    return query;
  }

  async findFiltered(
    filter?: EventsFilterInput,
    pagination?: PaginationInput,
  ): Promise<PaginatedEventsResponse> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    let query = this.repository.createQueryBuilder('event');
    query = this.setQuerySchema(query);

    if (filter) {
      if (filter.title) {
        query.andWhere('LOWER(event.title) LIKE LOWER(:title)', { 
          title: `%${filter.title}%` 
        });
      }
      if (filter.location) {
        query.andWhere('LOWER(event.location) LIKE LOWER(:location)', { 
          location: `%${filter.location}%` 
        });
      }
      if (filter.dateFrom) {
        query.andWhere('event.date >= :dateFrom', { dateFrom: filter.dateFrom });
      }
      if (filter.dateTo) {
        query.andWhere('event.date <= :dateTo', { dateTo: filter.dateTo });
      }
      if (filter.minAvailableTickets !== undefined) {
        query.andWhere('event.availableTickets >= :minTickets', { 
          minTickets: filter.minAvailableTickets 
        });
      }
      if (filter.hasAvailableTickets !== undefined) {
        query.andWhere(filter.hasAvailableTickets ? 
          'event.availableTickets > 0' : 
          'event.availableTickets = 0'
        );
      }
    }

    query.orderBy('event.date', 'ASC')
         .addOrderBy('event.createdAt', 'DESC');

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginatedEventsResponse({
      items,
      total,
      page,
      limit,
    });
  }

  async findById(id: string): Promise<Event> {
    const query = this.repository.createQueryBuilder('event')
      .where('event.id = :id', { id })
      .leftJoinAndSelect('event.bookings', 'bookings');
    
    this.setQuerySchema(query);
    
    const event = await query.getOne();

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async findAll(pagination?: PaginationInput): Promise<PaginatedEventsResponse> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    
    const query = this.repository.createQueryBuilder('event')
      .orderBy('event.date', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    this.setQuerySchema(query);
    
    const [items, total] = await query.getManyAndCount();

    return new PaginatedEventsResponse({
      items,
      total,
      page,
      limit,
    });
  }

  async findUpcoming(limit = 5): Promise<Event[]> {
    const query = this.repository.createQueryBuilder('event')
      .where('event.date > :now', { now: new Date() })
      .orderBy('event.date', 'ASC')
      .take(limit);

    this.setQuerySchema(query);
    
    return query.getMany();
  }

  async findPopular(limit = 5): Promise<Event[]> {
    const query = this.repository.createQueryBuilder('event')
      .orderBy('event.availableTickets', 'ASC')
      .addOrderBy('event.totalTickets', 'DESC')
      .take(limit);

    this.setQuerySchema(query);
    
    return query.getMany();
  }

  async create(data: Partial<Event>): Promise<Event> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (error) {
      this.logger.error('Failed to create event:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Event>): Promise<Event> {
    try {
      const entity = await this.findById(id);
      Object.assign(entity, data);
      return await this.repository.save(entity);
    } catch (error) {
      this.logger.error(`Failed to update event ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const entity = await this.findById(id);
      await this.repository.remove(entity);
    } catch (error) {
      this.logger.error(`Failed to delete event ${id}:`, error);
      throw error;
    }
  }
} 