import { Seeder } from './seed';
import { Event } from '../../events/entities/event.entity';
import { events } from './data/events.seed';
import { DataSource } from 'typeorm';

export class EventsSeeder extends Seeder {
  constructor(dataSource: DataSource) {
    super(dataSource, 'EventsSeeder');
  }

  async run(): Promise<void> {
    this.logger.log('Starting events seed...');
    
    try {
      const eventRepository = this.dataSource.getRepository(Event);
      
      for (const eventData of events) {
        const existingEvent = await eventRepository.findOne({
          where: { title: eventData.title }
        });

        if (!existingEvent) {
          await eventRepository.save(eventData);
          this.logger.log(`Created event: ${eventData.title}`);
        }
      }

      this.logger.log('Events seed completed successfully');
    } catch (error) {
      this.logger.error('Error seeding events:', error);
      throw error;
    }
  }
} 