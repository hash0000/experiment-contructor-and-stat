import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Statistic, StatisticDocument, StatisticsDataDocument } from '../database/entities/statistic.entity';

@Injectable()
export class StatisticRepository {
  constructor(@InjectModel(Statistic.name) private readonly statisticModel: Model<StatisticDocument>) {}

  public async selectStatisticForExcel(experimentId: string): Promise<StatisticDocument[]> {
    return await this.statisticModel.find({ experimentId }).exec();
  }

  async findByIdForNextSlide(
    sessionId: string,
    slideId: string,
  ): Promise<{
    _id: string;
    statistics: { slideId: string; jsStartTimestamp: number; data: StatisticsDataDocument[]; passingPosition: number; isChild: boolean };
  }> {
    return (
      await this.statisticModel
        .aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(sessionId),
              statistics: {
                $elemMatch: {
                  slideId: slideId,
                },
              },
            },
          },
          {
            $project: {
              _id: 1,
              statistics: { slideId: 1, jsStartTimestamp: 1, data: 1, passingPosition: 1, isChild: 1 },
            },
          },
          {
            $project: {
              statistics: {
                $filter: {
                  input: '$statistics',
                  as: 'item',
                  cond: { $eq: ['$$item.slideId', slideId] },
                },
              },
            },
          },
          { $unwind: '$statistics' },
          { $limit: 1 },
        ])
        .exec()
    )[0] as {
      _id: string;
      statistics: { slideId: string; jsStartTimestamp: number; data: StatisticsDataDocument[]; passingPosition: number; isChild: boolean };
    };
  }

  async countNotFinishedById(id: string): Promise<number> {
    return await this.statisticModel.countDocuments({ _id: id, finished: false }).exec();
  }

  async countUniversal(column: string, value: string, notId?: string, notIdArr?: string[]): Promise<number> {
    if (notId !== undefined) {
      return await this.statisticModel.countDocuments({ [column]: value, id: { $ne: notId } }).exec();
    }

    if (notIdArr !== undefined) {
      return await this.statisticModel.countDocuments({ [column]: value, id: { $nin: notIdArr } }).exec();
    }

    return await this.statisticModel.countDocuments({ [column]: value }).exec();
  }
}
