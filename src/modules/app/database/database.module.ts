import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresEntities } from './entities/postgres/_index';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_HOST,
      port: Number(process.env.POSTGRESQL_PORT),
      username: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PASSWORD,
      database: process.env.POSTGRESQL_DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
      entities: postgresEntities,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authMechanism=DEFAULT&authSource=admin&replicaSet=${process.env.MONGO_REPLICATION_NAME}`,
    ),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USER_STAT}:${process.env.MONGO_PASSWORD_STAT}@${process.env.MONGO_HOST_STAT}:${process.env.MONGO_PORT_STAT}/${process.env.MONGO_DATABASE_STAT}?authMechanism=DEFAULT&authSource=admin&replicaSet=${process.env.MONGO_REPLICATION_NAME_STAT}`,
      { connectionName: 'statistic' },
    ),
  ],
})
export class DatabaseModule {}
