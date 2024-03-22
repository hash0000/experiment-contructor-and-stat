import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variable, VariableSchema } from 'src/modules/app/database/entities/mongo/variable.schema';
import { ExperimentEntity } from 'src/modules/app/database/entities/postgres/experiment.entity';
import { SlideEntity } from 'src/modules/app/database/entities/postgres/slide.entity';
import { Statistic, StatisticSchema } from '../../appStatistic/database/entities/statistic.entity';
import { LanguageEntity } from '../database/entities/postgres/language.entity';
import { ExperimentController } from './experiment.controller';
import { ExperimentService } from './experiment.service';

@Module({
  providers: [ExperimentService],
  controllers: [ExperimentController],
  imports: [
    MongooseModule.forFeature([{ name: Variable.name, schema: VariableSchema }]),
    MongooseModule.forFeature([{ name: Statistic.name, schema: StatisticSchema }], 'statistic'),
    TypeOrmModule.forFeature([ExperimentEntity, SlideEntity, LanguageEntity]),
  ],
})
export class ExperimentModule {}
