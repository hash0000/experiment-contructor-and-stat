import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SetExperimentAccessBy } from 'src/common/decorators/setExperimentAccessBy.decorator';
import { SetExperimentStatusSensitive } from 'src/common/decorators/setExperimentStatusSensitive.decorator';
import { ExperimentAccessByEnum } from 'src/common/enums/experimentAccessBy.enum';
import { ValidationUuidParamPipe } from 'src/common/pipes/validationUuidParam.pipe';
import { OkResponse } from 'src/common/responses/ok.response';
import { UnauthorizedResponse } from 'src/common/responses/unauthorized.response';
import { CustomResponseType } from 'src/common/types/customResponseType';
import responseDescriptionConstant from '../../../common/constants/responseDescription.constant';
import { GetCurrentUserIdDecorator } from '../../../common/decorators/getCurrentUserId.decorator';
import { ExperimentAccessGuard } from '../../../common/guards/experimentAccess.guard';
import { InternalServerErrorResponse } from '../../../common/responses/internalServerError.response';
import { NoContentResponse } from '../../../common/responses/noContent.response';
import { UnprocessableEntityWithErrorResponse } from '../../../common/responses/unprocessableEntityResponse';
import { UpdateCycleChildDto } from './dto/cycle/updateCycleChild.dto';
import { UpdateAllSlidesColor } from './dto/updateAllSlidesColor.dto';
import { UpdateSlideDto } from './dto/updateSlide.dto';
import { CreateCycle201Response } from './responses/createCycle.response';
import { CreateSlide201Response } from './responses/createSlide.response';
import { CreateCycleChild201Response } from './responses/cycleChild/createCycleChild.response';
import { ReadByIdCycleChildResponse } from './responses/cycleChild/readByIdCycleChild.response';
import { ReadSlideById200Response } from './responses/readSlideById.response';
import { SlideService } from './slide.service';

@Controller('slide')
@ApiTags('Slide')
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @ApiOperation({ summary: 'Create' })
  @Post(':experimentId')
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateSlide201Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
    description: responseDescriptionConstant.UNAUTHORIZED,
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
  private async create(@Param('experimentId', ValidationUuidParamPipe) experimentId: string): Promise<CustomResponseType> {
    return await this.slideService.create(experimentId);
  }

  @ApiOperation({ summary: 'Read by id' })
  @Get(':slideId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.SLIDE)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadSlideById200Response,
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
  private async readById(@Param('slideId', ValidationUuidParamPipe) slideId: string): Promise<CustomResponseType> {
    return await this.slideService.readById(slideId);
  }

  @ApiOperation({ summary: 'Update' })
  @Patch(':slideId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.SLIDE)
  @SetExperimentStatusSensitive(true)
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
  private async updateSlide(@Body() dto: UpdateSlideDto, @Param('slideId', ValidationUuidParamPipe) slideId: string): Promise<CustomResponseType> {
    return await this.slideService.updateSlide(dto, slideId);
  }

  @ApiOperation({ summary: 'Update color (all slides)' })
  @Patch('color/:experimentId')
  @SetExperimentStatusSensitive(true)
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
  private async updateAllSlidesColor(
    @Body() dto: UpdateAllSlidesColor,
    @Param('experimentId', ValidationUuidParamPipe) experimentId: string,
  ): Promise<CustomResponseType> {
    return await this.slideService.updateAllSlidesColor(dto, experimentId);
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':slideId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.SLIDE)
  @SetExperimentStatusSensitive(true)
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
  private async delete(@Param('slideId', ValidationUuidParamPipe) slideId: string): Promise<CustomResponseType> {
    return await this.slideService.delete(slideId);
  }

  /* Cycle */
  @ApiOperation({ summary: 'Create cycle' })
  @Post('cycle/:experimentId')
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateCycle201Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
    description: responseDescriptionConstant.UNAUTHORIZED,
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
  private async createCycle(@Param('experimentId', ValidationUuidParamPipe) experimentId: string): Promise<CustomResponseType> {
    return await this.slideService.create(experimentId, true);
  }

  @ApiOperation({ summary: 'Create cycle child' })
  @Post('cycle/child/:slideId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.SLIDE)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateCycleChild201Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
    description: responseDescriptionConstant.UNAUTHORIZED,
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
  private async createCycleChild(@Param('slideId', ValidationUuidParamPipe) slideId: string): Promise<CustomResponseType> {
    return await this.slideService.createCycleChild(slideId);
  }

  @ApiOperation({ summary: 'Update cycle child' })
  @Patch('cycle/child/:childId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.CYCLE_CHILD)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
    description: responseDescriptionConstant.UNAUTHORIZED,
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
  private async updateCycleChild(
    @Body() dto: UpdateCycleChildDto,
    @Param('childId', ValidationUuidParamPipe) childId: string,
    @GetCurrentUserIdDecorator() userId: string,
  ): Promise<CustomResponseType> {
    return await this.slideService.updateCycleChild(dto, childId, userId);
  }

  @ApiOperation({ summary: 'Delete cycle child' })
  @Delete('cycle/child/:childId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.CYCLE_CHILD)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: NoContentResponse,
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
  private async deleteCycleChild(@Param('childId', ValidationUuidParamPipe) childId: string): Promise<CustomResponseType> {
    return await this.slideService.deleteCycleChild(childId);
  }

  @ApiOperation({ summary: 'Read cycle child by id' })
  @Get('cycle/child/:childId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.CYCLE_CHILD)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadByIdCycleChildResponse,
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
  private async readByIdCycleChild(@Param('childId', ValidationUuidParamPipe) childId: string): Promise<CustomResponseType> {
    return await this.slideService.readByIdCycleChild(childId);
  }
}
