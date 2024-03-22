import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideEntity } from 'src/modules/app/database/entities/postgres/slide.entity';
import { RowEntity } from '../database/entities/postgres/row.entity';
import { RowController } from './row.controller';
import { RowService } from './row.service';

@Module({
  providers: [RowService],
  controllers: [RowController],
  imports: [TypeOrmModule.forFeature([RowEntity, SlideEntity])],
})
export class RowModule {}
