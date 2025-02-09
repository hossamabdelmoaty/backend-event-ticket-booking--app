import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
    TableIndex,
} from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables with explicit path to backend .env
config({ path: join(__dirname, '../../../.env') });

export class CreateSchema1738798325527 implements MigrationInterface {
    name = 'CreateSchema1738798325527';
    
    private get schema() {
        if (!process.env.DB_SCHEMA) {
            throw new Error('DB_SCHEMA environment variable is required');
        }
        return process.env.DB_SCHEMA;
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create schema
        await queryRunner.createSchema(this.schema, true);

        // Create Events table
        await queryRunner.createTable(
            new Table({
                name: 'events',
                schema: this.schema,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '100',
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'date',
                        type: 'timestamp with time zone',
                    },
                    {
                        name: 'location',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'total_tickets',
                        type: 'integer',
                    },
                    {
                        name: 'available_tickets',
                        type: 'integer',
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                ],
                checks: [
                    {
                        name: 'chk_total_tickets_positive',
                        expression: 'total_tickets >= 0',
                    },
                    {
                        name: 'chk_available_tickets_range',
                        expression: 'available_tickets >= 0 AND available_tickets <= total_tickets',
                    },
                    {
                        name: 'chk_price_positive',
                        expression: 'price >= 0',
                    },
                ],
            })
        );

        // Create Users table
        await queryRunner.createTable(
            new Table({
                name: 'users',
                schema: this.schema,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                ],
            })
        );

        // Create Bookings table
        await queryRunner.createTable(
            new Table({
                name: 'bookings',
                schema: this.schema,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                    },
                    {
                        name: 'event_id',
                        type: 'uuid',
                    },
                    {
                        name: 'number_of_tickets',
                        type: 'integer',
                    },
                ],
                checks: [
                    {
                        name: 'chk_number_of_tickets',
                        expression: 'number_of_tickets > 0 AND number_of_tickets <= 10',
                    },
                ],
            })
        );

        // Create index on events.date
        await queryRunner.createIndex(
            `${this.schema}.events`,
            new TableIndex({
                name: 'idx_events_date',
                columnNames: ['date'],
            })
        );

        // Add foreign keys
        await queryRunner.createForeignKey(
            `${this.schema}.bookings`,
            new TableForeignKey({
                name: 'fk_bookings_user',
                columnNames: ['user_id'],
                referencedTableName: `${this.schema}.users`,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            `${this.schema}.bookings`,
            new TableForeignKey({
                name: 'fk_bookings_event',
                columnNames: ['event_id'],
                referencedTableName: `${this.schema}.events`,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );

        // Add composite index for bookings
        await queryRunner.createIndex(
            `${this.schema}.bookings`,
            new TableIndex({
                name: 'idx_bookings_user_event',
                columnNames: ['user_id', 'event_id'],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(`${this.schema}.bookings`, 'fk_bookings_event');
        await queryRunner.dropForeignKey(`${this.schema}.bookings`, 'fk_bookings_user');
        await queryRunner.dropIndex(`${this.schema}.events`, 'idx_events_date');
        await queryRunner.dropIndex(`${this.schema}.bookings`, 'idx_bookings_user_event');
        await queryRunner.dropTable(`${this.schema}.bookings`);
        await queryRunner.dropTable(`${this.schema}.users`);
        await queryRunner.dropTable(`${this.schema}.events`);
        await queryRunner.dropSchema(this.schema, true, true);
    }
}
