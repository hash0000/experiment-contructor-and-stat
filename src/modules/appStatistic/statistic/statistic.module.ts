import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Statistic, StatisticSchema } from '../database/entities/statistic.entity';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentEntity } from '../../app/database/entities/postgres/experiment.entity';

@Module({
  providers: [StatisticService],
  controllers: [StatisticController],
  imports: [MongooseModule.forFeature([{ name: Statistic.name, schema: StatisticSchema }]), TypeOrmModule.forFeature([ExperimentEntity])],
})
export class StatisticModule {}
