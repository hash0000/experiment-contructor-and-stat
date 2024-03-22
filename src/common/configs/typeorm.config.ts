import { config } from 'dotenv';
import { join } from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { postgresEntities } from '../../modules/app/database/entities/postgres/_index';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const migrationPath = `${process.env.MIGRATION_PATH || 'migrations'}`;

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port: Number(process.env.POSTGRESQL_PORT),
  username: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DATABASE_NAME,
  entities: postgresEntities,
  migrations: [join(__dirname + `/../../modules/app/database/${migrationPath}/*.js`)],
  migrationsTableName: 'TypeOrmMigrations',
});
PostgresDataSource.initialize()
  .then()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
