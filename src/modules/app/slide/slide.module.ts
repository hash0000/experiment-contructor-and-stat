import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariableSchema } from '../database/entities/variable.schema';
import { RowEntityP } from '../database/entities/postgres/row.entity';
import { CycleChildEntityP, SlideEntityP } from '../database/entities/postgres/slide.entity';
import { SlideController } from './slide.controller';
import { SlideService } from './slide.service';
import { SlideSchema } from '../database/entities/slide.entity';
import { SlideDescendantSchema } from '../database/entities/slideDescendant.entity';
import { RowEntitySchema } from '../database/entities/row.entity';
import { entityNameConstant } from '../../../common/constants/entityName.constant';

@Module({
  providers: [SlideService],
  controllers: [SlideController],
  imports: [
    MongooseModule.forFeature([
      { name: entityNameConstant.VARIABLE, schema: VariableSchema },
      {
        name: entityNameConstant.SLIDE,
        schema: SlideSchema,
      },
      { name: entityNameConstant.SLIDE_DESCENDANT, schema: SlideDescendantSchema },
      { name: entityNameConstant.ROW, schema: RowEntitySchema },
    ]),
    TypeOrmModule.forFeature([SlideEntityP, CycleChildEntityP, RowEntityP]),
  ],
})
export class SlideModule {}
