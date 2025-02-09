import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('bookings')
@ObjectType()
@Index(['userId', 'eventId'])
@Check('number_of_tickets > 0')
@Check('number_of_tickets <= 10')
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column('uuid', { name: 'user_id' })
  @Field(() => ID)
  @Index()
  userId!: string;

  @Column('uuid', { name: 'event_id' })
  @Field(() => ID)
  @Index()
  eventId!: string;

  @Column('int', { name: 'number_of_tickets' })
  @Field(() => Int)
  @Check('number_of_tickets > 0 AND number_of_tickets <= 10')
  numberOfTickets!: number;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.bookings)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user!: User;

  @ManyToOne(() => Event, event => event.bookings)
  @JoinColumn({ name: 'event_id' })
  @Field(() => Event)
  event!: Event;
} 