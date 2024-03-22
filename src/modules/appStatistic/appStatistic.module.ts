import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { BodyValidationPipe } from '../../common/pipes/bodyValidation.pipe';
import { JwtStrategy } from '../app/user/passport/jwt.strategy';
import { DatabaseStatModule } from './database/databaseStat.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    DatabaseStatModule,
    StatisticModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_PIPE,
      useClass: BodyValidationPipe,
    },
  ],
})
export class AppStatisticModule {}
