import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Statistic, StatisticSchema } from '../../appStatistic/database/entities/statistic.entity';
import { ExperimentEntityM, ExperimentSchema } from '../database/entities/experiment.entity';
import { LanguageEntityM, LanguageSchema } from '../database/entities/language.entity';
import { SlideEntityM, SlideSchema } from '../database/entities/slide.entity';
import { Variable, VariableSchema } from '../database/entities/variable.schema';
import { ExperimentController } from './experiment.controller';
import { ExperimentService } from './experiment.service';

@Module({
  providers: [ExperimentService],
  controllers: [ExperimentController],
  imports: [
    MongooseModule.forFeature([
      { name: ExperimentEntityM.name, schema: ExperimentSchema },
      { name: SlideEntityM.name, schema: SlideSchema },
      { name: Variable.name, schema: VariableSchema },
      { name: LanguageEntityM.name, schema: LanguageSchema },
    ]),
    MongooseModule.forFeature([{ name: Statistic.name, schema: StatisticSchema }], 'statistic'),
  ],
})
export class ExperimentModule {}
