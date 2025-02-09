import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@ObjectType()
@Entity('users', { schema: process.env.DB_SCHEMA })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column({ unique: true })
  @Field()
  email!: string;

  @Column()
  @Field()
  username!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;

  @OneToMany(() => Booking, booking => booking.user)
  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];
} 