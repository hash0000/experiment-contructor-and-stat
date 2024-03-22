import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentEntity } from '../database/entities/postgres/experiment.entity';
import { VariableController } from './variable.controller';
import { VariableService } from './variable.service';
import { Variable, VariableSchema } from '../database/entities/variable.schema';

@Module({
  providers: [VariableService],
  controllers: [VariableController],
  imports: [MongooseModule.forFeature([{ name: Variable.name, schema: VariableSchema }]), TypeOrmModule.forFeature([ExperimentEntity])],
})
export class VariableModule {}
