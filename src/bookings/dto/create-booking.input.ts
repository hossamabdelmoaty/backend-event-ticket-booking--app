import { Field, InputType, ID, Int } from '@nestjs/graphql';
import { IsUUID, IsInt, Min, Max } from 'class-validator';

@InputType()
export class CreateBookingInput {
  @Field(() => ID)
  @IsUUID('4', { message: 'Invalid event ID format' })
  eventId!: string;

  @Field(() => Int)
  @IsInt({ message: 'Number of tickets must be a whole number' })
  @Min(1, { message: 'Number of tickets must be at least 1' })
  @Max(10, { message: 'Cannot book more than 10 tickets at once' })
  numberOfTickets!: number;
} 