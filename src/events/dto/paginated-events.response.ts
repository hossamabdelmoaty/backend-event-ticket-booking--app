import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Event } from '../entities/event.entity';

@ObjectType()
export class PaginatedEventsResponse {
  @Field(() => [Event])
  items!: Event[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  constructor(partial: Partial<PaginatedEventsResponse>) {
    Object.assign(this, partial);
  }
} 