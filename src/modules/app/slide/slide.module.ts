import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RowEntity } from '../database/entities/postgres/row.entity';
import { CycleChildEntity, SlideEntity } from '../database/entities/postgres/slide.entity';
import { SlideChildEntityM, SlideChildSchema } from '../database/entities/slideChild.entity';
import { Variable, VariableSchema } from '../database/entities/variable.schema';
import { SlideController } from './slide.controller';
import { SlideService } from './slide.service';

@Module({
  providers: [SlideService],
  controllers: [SlideController],
  imports: [
    MongooseModule.forFeature([
      { name: Variable.name, schema: VariableSchema },
      { name: SlideChildEntityM.name, schema: SlideChildSchema },
    ]),
    TypeOrmModule.forFeature([SlideEntity, CycleChildEntity, RowEntity]),
  ],
})
export class SlideModule {}
