import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

export abstract class Seeder {
  protected logger: Logger;

  constructor(
    protected readonly dataSource: DataSource,
    protected readonly name: string
  ) {
    this.logger = new Logger(name);
  }

  abstract run(): Promise<void>;
} 