import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variable, VariableSchema } from '../database/entities/mongo/variable.schema';
import { RowEntity } from '../database/entities/postgres/row.entity';
import { CycleChildEntity, SlideEntity } from '../database/entities/postgres/slide.entity';
import { SlideController } from './slide.controller';
import { SlideService } from './slide.service';

@Module({
  providers: [SlideService],
  controllers: [SlideController],
  imports: [MongooseModule.forFeature([{ name: Variable.name, schema: VariableSchema }]), TypeOrmModule.forFeature([SlideEntity, CycleChildEntity, RowEntity])],
})
export class SlideModule {}
