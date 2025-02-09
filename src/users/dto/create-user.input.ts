import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can only contain letters, numbers, underscores and dashes',
  })
  username!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @Length(8, 255)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number',
  })
  password!: string;
} 