import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import dataSource from '../data-source';
import { UsersSeeder } from './users.seeder';
import { EventsSeeder } from './events.seeder';

const logger = new Logger('DatabaseSeeder');

async function runSeeds() {
  try {
    await dataSource.initialize();
    logger.log('Database connection initialized');

    // Run seeders in order
    const seeders = [
      new UsersSeeder(dataSource),
      new EventsSeeder(dataSource),
    ];

    for (const seeder of seeders) {
      await seeder.run();
    }

    logger.log('Database seeding completed successfully');
  } catch (error) {
    logger.error('Error during database seeding:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

runSeeds()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error('Fatal error during seeding:', error);
    process.exit(1);
  }); 