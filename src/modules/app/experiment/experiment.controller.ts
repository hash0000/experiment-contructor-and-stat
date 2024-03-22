import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SetExperimentStatusSensitive } from 'src/common/decorators/setExperimentStatusSensitive.decorator';
import { ExperimentAccessGuard } from 'src/common/guards/experimentAccess.guard';
import { ValidationNumberParamPipe } from 'src/common/pipes/validationNumberParam.pipe';
import { ForbiddenResponse } from 'src/common/responses/forbidden.response';
import { OkResponse } from 'src/common/responses/ok.response';
import { CustomResponseType } from 'src/common/types/customResponseType';
import responseDescriptionConstant from '../../../common/constants/responseDescription.constant';
import { GetCurrentUserIdDecorator } from '../../../common/decorators/getCurrentUserId.decorator';
import { NoAuth } from '../../../common/decorators/noAuth.decorator';
import { ValidationUuidParamPipe } from '../../../common/pipes/validationUuidParam.pipe';
import { ConflictWithErrorResponse } from '../../../common/responses/conflict.response';
import { InternalServerErrorResponse } from '../../../common/responses/internalServerError.response';
import { UnauthorizedResponse } from '../../../common/responses/unauthorized.response';
import { UnprocessableEntityWithErrorResponse } from '../../../common/responses/unprocessableEntityResponse';
import { CreateExperimentDto } from './dto/createExperiment.dto';
import { ReadExperimentsDto } from './dto/readExperiments.dto';
import { StartExperimentDto } from './dto/startExperiment.dto';
import { StartExperimentPreviewDto } from './dto/startExperimentPreview.dto';
import { UpdateExperimentDto } from './dto/updateExperiment.dto';
import { UpdateExperimentStatusDto } from './dto/updateExperimentStatus.dto';
import { ExperimentService } from './experiment.service';
import { CreateExperiment201Response } from './responses/createExperiment.response';
import { ReadExperiments200Response } from './responses/readExperiments.response';
import { ReadOwnExperimentById200Response } from './responses/readOwnExperimentById.response';
import { UpdateExperimentSettings200Response } from './responses/updateExperimentSettings.response';
import { GetByIdDto } from './dto/getById.dto';

@Controller('experiment')
@ApiTags('Experiment')
export class ExperimentController {
  constructor(private readonly experimentService: ExperimentService) {}

  @ApiOperation({ summary: 'Create' })
  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateExperiment201Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictWithErrorResponse,
    description: responseDescriptionConstant.CONFLICT,
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
  private async createExperiment(@Body() dto: CreateExperimentDto, @GetCurrentUserIdDecorator() userId: string): Promise<CustomResponseType> {
    return await this.experimentService.createExperiment(dto, userId);
  }

  @ApiOperation({ summary: 'Update' })
  @Patch('/:experimentId')
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateExperimentSettings200Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenResponse,
    description: responseDescriptionConstant.FORBIDDEN,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictWithErrorResponse,
    description: responseDescriptionConstant.CONFLICT,
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
  private async updateExperiment(
    @Body() dto: UpdateExperimentDto,
    @GetCurrentUserIdDecorator() userId: string,
    @Param('experimentId', ValidationUuidParamPipe) experimentId: string,
  ): Promise<CustomResponseType> {
    return await this.experimentService.updateExperiment(dto, experimentId, userId);
  }

  @ApiOperation({ summary: 'Update status' })
  @Patch('status/:experimentId')
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateExperimentSettings200Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenResponse,
    description: responseDescriptionConstant.FORBIDDEN,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictWithErrorResponse,
    description: responseDescriptionConstant.CONFLICT,
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
  private async updateExperimentStatus(
    @Body() dto: UpdateExperimentStatusDto,
    @Param('experimentId', ValidationUuidParamPipe) experimentId: string,
  ): Promise<CustomResponseType> {
    return await this.experimentService.updateExperimentStatus(dto, experimentId);
  }

  @ApiOperation({ summary: 'Read many (private)' })
  @Get('own/all/:page')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadExperiments200Response,
    description: responseDescriptionConstant.SUCCESS,
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
  private async readOwnExperiments(
    @GetCurrentUserIdDecorator() userId: string,
    @Param('page', ValidationNumberParamPipe) page: number,
    @Query() dtoQuery: ReadExperimentsDto,
  ): Promise<CustomResponseType> {
    return await this.experimentService.readExperiments(page, dtoQuery, userId);
  }

  @ApiOperation({ summary: 'Read many' })
  @Get('all/:page')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadExperiments200Response,
    description: responseDescriptionConstant.SUCCESS,
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
  private async readExperiments(@Param('page', ValidationNumberParamPipe) page: number, @Query() dtoQuery: ReadExperimentsDto): Promise<CustomResponseType> {
    return await this.experimentService.readExperiments(page, dtoQuery);
  }

  @ApiOperation({ summary: 'Read by id (private)' })
  @Get('own/:experimentId')
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadOwnExperimentById200Response,
    description: responseDescriptionConstant.SUCCESS,
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
  private async readOwnExperimentById(
    @Param('experimentId', ValidationUuidParamPipe) experimentId: string,
    @Query() query: GetByIdDto,
  ): Promise<CustomResponseType> {
    return await this.experimentService.readExperimentById(experimentId, false, query.isShouldSlides);
  }

  @ApiOperation({ summary: 'Read by id (public)' })
  @Get('/:experimentId')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
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
  private async readExperimentById(@Param('experimentId', ValidationUuidParamPipe) experimentId: string): Promise<CustomResponseType> {
    return await this.experimentService.readExperimentById(experimentId, true);
  }

  @ApiOperation({ summary: 'Start (preview)' })
  @Post('own/preview/:experimentId')
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadOwnExperimentById200Response,
    description: responseDescriptionConstant.SUCCESS,
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
  private async startExperimentPreview(
    @Body() dto: StartExperimentPreviewDto,
    @Param('experimentId', ValidationUuidParamPipe) experimentId: string,
  ): Promise<CustomResponseType> {
    return await this.experimentService.startExperimentPreview(dto, experimentId);
  }

  @ApiOperation({ summary: 'Start' })
  @Post('start/:experimentId')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadOwnExperimentById200Response,
    description: responseDescriptionConstant.SUCCESS,
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
  private async startExperiment(
    @Param('experimentId', ValidationUuidParamPipe) experimentId: string,
    @Body() dto: StartExperimentDto,
  ): Promise<CustomResponseType> {
    return await this.experimentService.startExperiment(dto, experimentId);
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':experimentId')
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
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
  private async delete(@Param('experimentId', ValidationUuidParamPipe) experimentId: string): Promise<CustomResponseType> {
    return await this.experimentService.delete(experimentId);
  }
}
