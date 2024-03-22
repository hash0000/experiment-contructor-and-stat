import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideEntityP } from 'src/modules/app/database/entities/postgres/slide.entity';
import { RowEntityP } from '../database/entities/postgres/row.entity';
import { RowController } from './row.controller';
import { RowService } from './row.service';

@Module({
  providers: [RowService],
  controllers: [RowController],
  imports: [TypeOrmModule.forFeature([RowEntityP, SlideEntityP])],
})
export class RowModule {}
