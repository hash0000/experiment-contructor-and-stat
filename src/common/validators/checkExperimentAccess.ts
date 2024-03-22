import { HttpStatus } from '@nestjs/common';
import { ExperimentEntityP, ExperimentStatusEnum } from 'src/modules/app/database/entities/postgres/experiment.entity';
import { RowEntityP } from '../../modules/app/database/entities/postgres/row.entity';
import { CycleChildEntityP, SlideEntityP } from '../../modules/app/database/entities/postgres/slide.entity';
import { PostgresDataSource } from '../configs/typeorm.config';
import { ExperimentAccessByEnum } from '../enums/experimentAccessBy.enum';
import { ExperimentAccessStatusEnum } from '../enums/experimentAccessStatus.enum';
import { CustomException } from '../exceptions/custom.exception';

export async function CheckExperimentAccess(
  entryId: string,
  userId: string,
  accessBy: ExperimentAccessByEnum,
  publishedSensitive?: boolean,
): Promise<ExperimentAccessStatusEnum> {
  const queryRunner = PostgresDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    let count: ExperimentAccessStatusEnum;
    switch (accessBy) {
      case ExperimentAccessByEnum.EXPERIMENT:
        if (publishedSensitive) {
          const temp = await queryRunner.manager.getRepository(ExperimentEntityP).findOne({
            where: {
              id: entryId,
              user: {
                id: userId,
              },
            },
            select: {
              id: true,
              status: true,
            },
          });
          if (!temp) {
            return ExperimentAccessStatusEnum.NO_USER_ACCESS;
          } else if (temp?.status === ExperimentStatusEnum.PUBLISHED || temp?.status === ExperimentStatusEnum.RESTRICTED) {
            return ExperimentAccessStatusEnum.NO_STATUS_ACCESS;
          } else {
            return ExperimentAccessStatusEnum.ACCESS_ALLOW;
          }
        } else {
          count = await queryRunner.manager.getRepository(ExperimentEntityP).count({
            where: {
              id: entryId,
              user: {
                id: userId,
              },
            },
          });
        }
        break;

      case ExperimentAccessByEnum.SLIDE:
        if (publishedSensitive) {
          const temp = await queryRunner.manager.getRepository(SlideEntityP).findOne({
            where: {
              id: entryId,
              experiment: {
                user: {
                  id: userId,
                },
              },
            },
            relations: {
              experiment: true,
            },
            select: {
              experiment: {
                id: true,
                status: true,
              },
            },
          });
          if (!temp) {
            return ExperimentAccessStatusEnum.NO_USER_ACCESS;
          } else if (temp?.experiment?.status === ExperimentStatusEnum.PUBLISHED || temp?.experiment?.status === ExperimentStatusEnum.RESTRICTED) {
            return ExperimentAccessStatusEnum.NO_STATUS_ACCESS;
          } else {
            return ExperimentAccessStatusEnum.ACCESS_ALLOW;
          }
        } else {
          count = await queryRunner.manager.getRepository(SlideEntityP).count({
            where: {
              id: entryId,
              experiment: {
                user: {
                  id: userId,
                },
              },
            },
          });
        }
        break;

      case ExperimentAccessByEnum.ROW:
        if (publishedSensitive) {
          const temp = await queryRunner.manager.getRepository(RowEntityP).findOne({
            where: {
              id: entryId,
              slide: {
                experiment: {
                  user: {
                    id: userId,
                  },
                },
              },
            },
            relations: {
              slide: {
                experiment: true,
              },
            },
            select: {
              id: true,
              slide: {
                id: true,
                experiment: {
                  id: true,
                  status: true,
                },
              },
            },
          });
          if (!temp) {
            return ExperimentAccessStatusEnum.NO_USER_ACCESS;
          } else if (
            temp?.slide?.experiment?.status === ExperimentStatusEnum.PUBLISHED ||
            temp?.slide?.experiment?.status === ExperimentStatusEnum.RESTRICTED
          ) {
            return ExperimentAccessStatusEnum.NO_STATUS_ACCESS;
          } else {
            return ExperimentAccessStatusEnum.ACCESS_ALLOW;
          }
        } else {
          count = await queryRunner.manager.getRepository(RowEntityP).count({
            where: {
              id: entryId,
              slide: {
                experiment: {
                  user: {
                    id: userId,
                  },
                },
              },
            },
          });
        }
        break;

      case ExperimentAccessByEnum.ROW_ELEM_CHILD:
        if (publishedSensitive) {
          const temp = await queryRunner.manager.getRepository(RowEntityP).findOne({
            where: {
              id: entryId,
              slideChild: {
                cycle: {
                  experiment: {
                    user: {
                      id: userId,
                    },
                  },
                },
              },
            },
            relations: {
              slideChild: {
                cycle: {
                  experiment: true,
                },
              },
            },
            select: {
              slideChild: {
                cycle: {
                  experiment: {
                    id: true,
                    status: true,
                  },
                },
              },
            },
          });
          if (!temp) {
            return ExperimentAccessStatusEnum.NO_USER_ACCESS;
          } else if (
            temp?.slide?.experiment?.status === ExperimentStatusEnum.PUBLISHED ||
            temp?.slide?.experiment?.status === ExperimentStatusEnum.RESTRICTED
          ) {
            return ExperimentAccessStatusEnum.NO_STATUS_ACCESS;
          } else {
            return ExperimentAccessStatusEnum.ACCESS_ALLOW;
          }
        } else {
          count = await queryRunner.manager.getRepository(RowEntityP).count({
            where: {
              id: entryId,
              slideChild: {
                cycle: {
                  experiment: {
                    user: {
                      id: userId,
                    },
                  },
                },
              },
            },
          });
        }
        break;

      case ExperimentAccessByEnum.CYCLE_CHILD:
        if (publishedSensitive) {
          const temp = await queryRunner.manager.getRepository(CycleChildEntityP).findOne({
            where: {
              id: entryId,
              cycle: {
                experiment: {
                  user: {
                    id: userId,
                  },
                },
              },
            },
            relations: {
              cycle: {
                experiment: true,
              },
            },
            select: {
              cycle: {
                experiment: {
                  id: true,
                  status: true,
                },
              },
            },
          });
          if (!temp) {
            return ExperimentAccessStatusEnum.NO_USER_ACCESS;
          } else if (
            temp?.cycle?.experiment?.status === ExperimentStatusEnum.PUBLISHED ||
            temp?.cycle?.experiment?.status === ExperimentStatusEnum.RESTRICTED
          ) {
            return ExperimentAccessStatusEnum.NO_STATUS_ACCESS;
          } else {
            return ExperimentAccessStatusEnum.ACCESS_ALLOW;
          }
        } else {
          count = await queryRunner.manager.getRepository(CycleChildEntityP).count({
            where: {
              id: entryId,
              cycle: {
                experiment: {
                  user: {
                    id: userId,
                  },
                },
              },
            },
          });
        }
        break;
    }

    if (count >= 1) {
      return ExperimentAccessStatusEnum.ACCESS_ALLOW;
    }
    return ExperimentAccessStatusEnum.NO_USER_ACCESS;
  } catch (e) {
    console.log(e);
    throw new CustomException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  } finally {
    await queryRunner.release();
  }
}
