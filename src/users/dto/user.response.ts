import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Exclude, Expose } from 'class-transformer';

@ObjectType()
export class UserResponse {
  @Expose()
  @Field(() => ID)
  id!: string;

  @Expose()
  @Field()
  username!: string;

  @Expose()
  @Field()
  email!: string;

  @Expose()
  @Field()
  createdAt!: Date;

  @Expose()
  @Field()
  updatedAt!: Date;

  @Exclude()
  password!: string;
} 