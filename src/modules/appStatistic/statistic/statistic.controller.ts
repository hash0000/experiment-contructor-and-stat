import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import responseDescriptionConstant from 'src/common/constants/responseDescription.constant';
import { ValidateObjectIdPipe } from 'src/common/pipes/validateObjectId.pipe';
import { ForbiddenResponse } from 'src/common/responses/forbidden.response';
import { InternalServerErrorResponse } from 'src/common/responses/internalServerError.response';
import { UnauthorizedResponse } from 'src/common/responses/unauthorized.response';
import { UnprocessableEntityWithErrorResponse } from 'src/common/responses/unprocessableEntityResponse';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { NoAuth } from '../../../common/decorators/noAuth.decorator';
import { ValidationUuidParamPipe } from '../../../common/pipes/validationUuidParam.pipe';
import { ConflictWithErrorResponse } from '../../../common/responses/conflict.response';
import { OkResponse } from '../../../common/responses/ok.response';
import { FinishExperimentDto } from './dto/finishExperiment.dto';
import { StartNextSlideDto } from './dto/startNextSlide.dto';
import { UpdateStatisticDataDto } from './dto/updateStatisticData.dto';
import { StatisticService } from './statistic.service';

@ApiTags('Statistic')
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @ApiOperation({ summary: 'Start next slide' })
  @Patch('start-next-slide/:sessionId')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenResponse,
    description: responseDescriptionConstant.FORBIDDEN,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictWithErrorResponse,
    description: responseDescriptionConstant.FORBIDDEN,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorResponse,
    description: responseDescriptionConstant.INTERNAL_SERVER_ERROR,
  })
  private async startNextSlide(@Param('sessionId', ValidateObjectIdPipe) sessionId: string, @Body() dto: StartNextSlideDto): Promise<CustomResponseType> {
    return await this.statisticService.startNextSlide(dto, sessionId);
  }

  @ApiOperation({ summary: 'Update statistic data' })
  @Patch('update-statistic-data/:sessionId/:slideId')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenResponse,
    description: responseDescriptionConstant.FORBIDDEN,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorResponse,
    description: responseDescriptionConstant.INTERNAL_SERVER_ERROR,
  })
  private async updateStatisticData(
    @Param('sessionId', ValidateObjectIdPipe) sessionId: string,
    @Param('slideId', ValidationUuidParamPipe) slideId: string,
    @Body() dto: UpdateStatisticDataDto,
  ): Promise<CustomResponseType> {
    return await this.statisticService.updateStatisticData(dto, sessionId, slideId);
  }

  @ApiOperation({ summary: 'Get Excel file' })
  @Get('get-excel-file/:experimentId')
  @ApiBearerAuth()
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenResponse,
    description: responseDescriptionConstant.FORBIDDEN,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
    description: responseDescriptionConstant.UNAUTHORIZED,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorResponse,
    description: responseDescriptionConstant.INTERNAL_SERVER_ERROR,
  })
  private async exportToExcel(@Res() res: Response, @Param('experimentId', ValidationUuidParamPipe) experimentId: string) {
    return await this.statisticService.exportToExcel(experimentId, res);
  }

  @ApiOperation({ summary: 'Finish experiment' })
  @Patch('finish-experiment/:sessionId')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenResponse,
    description: responseDescriptionConstant.FORBIDDEN,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictWithErrorResponse,
    description: responseDescriptionConstant.FORBIDDEN,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorResponse,
    description: responseDescriptionConstant.INTERNAL_SERVER_ERROR,
  })
  private async finishExperiment(@Param('sessionId', ValidateObjectIdPipe) sessionId: string, @Body() dto: FinishExperimentDto): Promise<CustomResponseType> {
    return await this.statisticService.finishExperiment(dto, sessionId);
  }

  @Get('clear-all-sessions')
  private async clearAllSession() {
    return await this.statisticService.clearAllSessions();
  }
}
