import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { BodyValidationPipe } from '../../common/pipes/bodyValidation.pipe';
import { DatabaseModule } from './database/database.module';
import { ExperimentModule } from './experiment/experiment.module';
import { RowModule } from './row/row.module';
import { SlideModule } from './slide/slide.module';
import { UserModule } from './user/user.module';
import { VariableModule } from './variable/variable.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    UserModule,
    ExperimentModule,
    SlideModule,
    RowModule,
    VariableModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: BodyValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
