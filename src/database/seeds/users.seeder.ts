import { Seeder } from './seed';
import { User } from '../../users/entities/user.entity';
import { users } from './data/users.seed';
import { DataSource } from 'typeorm';

export class UsersSeeder extends Seeder {
  constructor(dataSource: DataSource) {
    super(dataSource, 'UsersSeeder');
  }

  async run(): Promise<void> {
    this.logger.log('Starting users seed...');
    
    try {
      const userRepository = this.dataSource.getRepository(User);
      
      for (const userData of users) {
        const existingUser = await userRepository.findOne({
          where: { email: userData.email }
        });

        if (!existingUser) {
          await userRepository.save(userData);
          this.logger.log(`Created user: ${userData.email}`);
        }
      }

      this.logger.log('Users seed completed successfully');
    } catch (error) {
      this.logger.error('Error seeding users:', error);
      throw error;
    }
  }
} 