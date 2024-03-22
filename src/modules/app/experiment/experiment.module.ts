import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Statistic, StatisticSchema } from '../../appStatistic/database/entities/statistic.entity';
import { ExperimentSchema } from '../database/entities/experiment.entity';
import { LanguageSchema } from '../database/entities/language.entity';
import { SlideSchema } from '../database/entities/slide.entity';
import { VariableSchema } from '../database/entities/variable.schema';
import { ExperimentController } from './experiment.controller';
import { ExperimentService } from './experiment.service';
import { entityNameConstant } from '../../../common/constants/entityName.constant';

@Module({
  providers: [ExperimentService],
  controllers: [ExperimentController],
  imports: [
    MongooseModule.forFeature([
      { name: entityNameConstant.EXPERIMENT, schema: ExperimentSchema },
      { name: entityNameConstant.SLIDE, schema: SlideSchema },
      { name: entityNameConstant.VARIABLE, schema: VariableSchema },
      { name: entityNameConstant.LANGUAGE, schema: LanguageSchema },
    ]),
    MongooseModule.forFeature([{ name: Statistic.name, schema: StatisticSchema }], 'statistic'),
  ],
})
export class ExperimentModule {}
