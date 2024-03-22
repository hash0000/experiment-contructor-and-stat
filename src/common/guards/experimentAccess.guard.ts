import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isUUID } from 'class-validator';
import { CustomErrorTypeEnum, ValidationErrorTypeEnum } from '../enums/errorType.enum';
import { ExperimentAccessByEnum } from '../enums/experimentAccessBy.enum';
import { ExperimentAccessStatusEnum } from '../enums/experimentAccessStatus.enum';
import { CustomException } from '../exceptions/custom.exception';
import { ValidationException } from '../exceptions/validation.exception';
import { JwtPayloadType } from '../types/jwtPayload.type';
import { CheckExperimentAccess } from '../validators/checkExperimentAccess';

@Injectable()
export class ExperimentAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayloadType;

    let statusSensitive = this.reflector.get<boolean>('statusSensitive', context.getHandler());
    if (statusSensitive === undefined) {
      statusSensitive = false;
    }
    if (typeof statusSensitive !== 'boolean') {
      throw new CustomException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_ERROR_WHILE_CHECK_ACCESS,
      });
    }

    let accessBy = this.reflector.get<ExperimentAccessByEnum>('experimentAccessBy', context.getHandler());
    if (accessBy === undefined) {
      accessBy = ExperimentAccessByEnum.EXPERIMENT;
    }

    let checkExperimentAccess: ExperimentAccessStatusEnum;
    let entryId: string;
    switch (accessBy) {
      case ExperimentAccessByEnum.EXPERIMENT:
        if (request?.params?.experimentId) entryId = request.params.experimentId;
        if (request?.body?.experimentId) entryId = request.body.experimentId;
        this.validateEntryId(entryId);
        checkExperimentAccess = await CheckExperimentAccess(entryId, user.id, ExperimentAccessByEnum.EXPERIMENT, statusSensitive);
        break;

      case ExperimentAccessByEnum.SLIDE:
        if (request?.params?.slideId) entryId = request.params.slideId;
        if (request?.body?.slideId) entryId = request.body.slideId;
        this.validateEntryId(entryId);
        checkExperimentAccess = await CheckExperimentAccess(entryId, user.id, ExperimentAccessByEnum.SLIDE, statusSensitive);
        break;

      case ExperimentAccessByEnum.ROW:
        if (request?.params?.rowId) entryId = request.params.rowId;
        if (request?.body?.rowId) entryId = request.body.rowId;
        this.validateEntryId(entryId);
        checkExperimentAccess = await CheckExperimentAccess(entryId, user.id, ExperimentAccessByEnum.ROW, statusSensitive);
        break;

      case ExperimentAccessByEnum.ROW_ELEM_CHILD:
        if (request?.params?.rowId) entryId = request.params.rowId;
        if (request?.body?.rowId) entryId = request.body.rowId;
        this.validateEntryId(entryId);
        checkExperimentAccess = await CheckExperimentAccess(entryId, user.id, ExperimentAccessByEnum.ROW_ELEM_CHILD, statusSensitive);
        break;

      case ExperimentAccessByEnum.CYCLE_CHILD:
        if (request?.params?.childId) entryId = request.params.childId;
        if (request?.body?.childId) entryId = request.body.childId;
        this.validateEntryId(entryId);
        checkExperimentAccess = await CheckExperimentAccess(entryId, user.id, ExperimentAccessByEnum.CYCLE_CHILD, statusSensitive);
        break;

      default:
        throw new CustomException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_ERROR_WHILE_CHECK_ACCESS,
        });
    }
    if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_USER_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.NO_ACCESS_OR_DATA_NOT_FOUND,
      });
    } else if (checkExperimentAccess === ExperimentAccessStatusEnum.NO_STATUS_ACCESS) {
      throw new CustomException({
        statusCode: HttpStatus.FORBIDDEN,
        errorTypeCode: CustomErrorTypeEnum.EXPERIMENT_CAN_NOT_UPDATE_PUBLISHED,
      });
    }
    return true;
  }

  private validateEntryId(entryId: string): void {
    if (!isUUID(entryId, 4)) {
      throw new ValidationException([{ property: 'id', validationErrorTypeCode: ValidationErrorTypeEnum.IS_UUID }]);
    }
    if (!entryId) {
      throw new CustomException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        errorTypeCode: CustomErrorTypeEnum.ID_NOT_FOUND,
      });
    }
  }
}
