import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentEntity } from '../../app/database/entities/postgres/experiment.entity';
import { Statistic, StatisticSchema } from '../database/entities/statistic.entity';
import { StatisticController } from './statistic.controller';
import { StatisticRepository } from './statistic.repository';
import { StatisticService } from './statistic.service';

@Module({
  providers: [StatisticService, StatisticRepository],
  controllers: [StatisticController],
  imports: [MongooseModule.forFeature([{ name: Statistic.name, schema: StatisticSchema }]), TypeOrmModule.forFeature([ExperimentEntity])],
})
export class StatisticModule {}
