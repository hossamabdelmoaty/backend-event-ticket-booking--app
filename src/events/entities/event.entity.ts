import { Field, Int, Float, ObjectType, ID } from '@nestjs/graphql';
import { Check, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@ObjectType()
@Entity('events')
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column({ length: 100 })
  @Field()
  title!: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ type: 'timestamptz' })
  @Field(() => Date)
  @Index('idx_events_date')
  date!: Date;

  @Column({ length: 255 })
  @Field()
  location!: string;

  @Column({ name: 'total_tickets', type: 'int' })
  @Field(() => Int)
  @Check('total_tickets >= 0')
  totalTickets!: number;

  @Column({ name: 'available_tickets', type: 'int' })
  @Field(() => Int)
  @Check('available_tickets >= 0')
  @Check('available_tickets <= total_tickets')
  availableTickets!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field(() => Float)
  @Check('price >= 0')
  price!: number;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updatedAt!: Date;

  @OneToMany(() => Booking, booking => booking.event)
  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];
} 