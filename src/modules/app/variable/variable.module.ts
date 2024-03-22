import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariableSchema } from '../database/entities/variable.schema';
import { ExperimentEntityP } from '../database/entities/postgres/experiment.entity';
import { VariableController } from './variable.controller';
import { VariableService } from './variable.service';
import { entityNameConstant } from '../../../common/constants/entityName.constant';

@Module({
  providers: [VariableService],
  controllers: [VariableController],
  imports: [MongooseModule.forFeature([{ name: entityNameConstant.VARIABLE, schema: VariableSchema }]), TypeOrmModule.forFeature([ExperimentEntityP])],
})
export class VariableModule {}
