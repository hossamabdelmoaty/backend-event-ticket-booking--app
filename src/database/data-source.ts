import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables with explicit path
config({ path: join(__dirname, '../../.env') });

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME', 'DB_SCHEMA'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false, // Disable in production
  logging: true, // Enable logging to see what's happening
  ssl: process.env.DB_SSL_ENABLED === 'true',
};

const dataSource = new DataSource(dataSourceOptions);

// Schema management functions
export async function initializeSchema() {
  const ds = await dataSource.initialize();
  const queryRunner = ds.createQueryRunner();
  try {
    await queryRunner.createSchema(process.env.DB_SCHEMA!, true);
    console.log(`Schema ${process.env.DB_SCHEMA} created successfully`);
  } catch (error) {
    console.error('Error creating schema:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

export async function dropSchema() {
  const ds = await dataSource.initialize();
  const queryRunner = ds.createQueryRunner();
  try {
    await queryRunner.dropSchema(process.env.DB_SCHEMA!, true, true);
    console.log(`Schema ${process.env.DB_SCHEMA} dropped successfully`);
  } catch (error) {
    console.error('Error dropping schema:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

export default dataSource; 