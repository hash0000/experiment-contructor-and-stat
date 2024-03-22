import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SetExperimentAccessBy } from 'src/common/decorators/setExperimentAccessBy.decorator';
import { SetExperimentStatusSensitive } from 'src/common/decorators/setExperimentStatusSensitive.decorator';
import { ExperimentAccessByEnum } from 'src/common/enums/experimentAccessBy.enum';
import { ExperimentAccessGuard } from 'src/common/guards/experimentAccess.guard';
import { ValidationUuidParamPipe } from 'src/common/pipes/validationUuidParam.pipe';
import { OkResponse } from 'src/common/responses/ok.response';
import { CustomResponseType } from 'src/common/types/customResponseType';
import responseDescriptionConstant from '../../../common/constants/responseDescription.constant';
import { InternalServerErrorResponse } from '../../../common/responses/internalServerError.response';
import { UnauthorizedResponse } from '../../../common/responses/unauthorized.response';
import { UnprocessableEntityWithErrorResponse } from '../../../common/responses/unprocessableEntityResponse';
import { CreateRowDto } from './dto/createRow.dto';
import { CreateRowElementDto } from './dto/createRowElement.dto';
import { UpdateRowElementsDto } from './dto/updateRowElements.dto';
import { CreateRow201Response } from './responses/createRow.response';
import { CreateRowElement200Response } from './responses/createRowElement.response';
import { DeleteRow200Response } from './responses/deleteRow.response';
import { UpdateRowElements200Response } from './responses/updateRowElements.response';
import { RowService } from './row.service';

@Controller('row')
@ApiTags('Row')
export class RowController {
  constructor(private readonly rowService: RowService) {}

  @ApiOperation({ summary: 'Create' })
  @Post(':slideId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.SLIDE)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: CreateRow201Response,
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
  private async createRow(@Param('slideId', ValidationUuidParamPipe) slideId: string, @Body() dto: CreateRowDto): Promise<CustomResponseType> {
    return await this.rowService.createRow(dto, slideId);
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':rowId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.ROW)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteRow200Response,
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
  private async deleteRow(@Param('rowId', ValidationUuidParamPipe) rowId: string): Promise<CustomResponseType> {
    return await this.rowService.deleteRow(rowId);
  }

  @ApiOperation({ summary: 'Delete many' })
  @Delete('all/:slideId')
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
  private async deleteRows(@Param('slideId', ValidationUuidParamPipe) slideId: string): Promise<CustomResponseType> {
    return await this.rowService.deleteRows(slideId);
  }

  /* Slide elements */
  @ApiOperation({ summary: 'Create element' })
  @Post(':rowId/create-element')
  @SetExperimentAccessBy(ExperimentAccessByEnum.ROW)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateRowElement200Response,
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
  private async createRowElement(@Param('rowId', ValidationUuidParamPipe) rowId: string, @Body() dto: CreateRowElementDto): Promise<CustomResponseType> {
    return await this.rowService.createRowElement(dto, rowId);
  }

  @ApiOperation({ summary: 'Update elements' })
  @Patch(':rowId/update-elements')
  @SetExperimentAccessBy(ExperimentAccessByEnum.ROW)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateRowElements200Response,
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
  private async updateRowElements(@Param('rowId', ValidationUuidParamPipe) rowId: string, @Body() dto: UpdateRowElementsDto): Promise<CustomResponseType> {
    return await this.rowService.updateRowElements(dto, rowId);
  }

  /* Cycle */
  @ApiOperation({ summary: 'Create (for cycle)' })
  @Post('cycle/:childId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.CYCLE_CHILD)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: CreateRow201Response,
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
  private async createRowForCycle(@Param('childId', ValidationUuidParamPipe) childId: string, @Body() dto: CreateRowDto): Promise<CustomResponseType> {
    return await this.rowService.createRow(dto, childId, true);
  }

  @ApiOperation({ summary: 'Delete many (for cycle)' })
  @Delete('all/cycle/:childId')
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
  private async deleteRowsForCycle(@Param('childId', ValidationUuidParamPipe) childId: string): Promise<CustomResponseType> {
    return await this.rowService.deleteRows(childId, true);
  }

  @ApiOperation({ summary: 'Delete (for cycle)' })
  @Delete('cycle/:rowId/:childId')
  @SetExperimentAccessBy(ExperimentAccessByEnum.ROW_ELEM_CHILD)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteRow200Response,
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
  @HttpCode(HttpStatus.OK)
  @Delete('cycle/:rowId/:childId')
  private async deleteRowForCycle(@Param('rowId', ValidationUuidParamPipe) rowId: string, @Param('childId', ValidationUuidParamPipe) childId: string) {
    return await this.rowService.deleteRow(rowId, childId, true);
  }

  /* Cycle elements */
  @ApiOperation({ summary: 'Create element (for cycle)' })
  @Post('/cycle/:rowId/create-element')
  @SetExperimentAccessBy(ExperimentAccessByEnum.ROW_ELEM_CHILD)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateRowElement200Response,
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
  private async createRowCycleElement(@Param('rowId', ValidationUuidParamPipe) rowId: string, @Body() dto: CreateRowElementDto): Promise<CustomResponseType> {
    return await this.rowService.createRowElement(dto, rowId, true);
  }

  @ApiOperation({ summary: 'Update elements (cycle)' })
  @Patch('cycle/:rowId/update-elements')
  @SetExperimentAccessBy(ExperimentAccessByEnum.ROW_ELEM_CHILD)
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateRowElements200Response,
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
  private async updateRowCycleElements(@Param('rowId', ValidationUuidParamPipe) rowId: string, @Body() dto: UpdateRowElementsDto): Promise<CustomResponseType> {
    return await this.rowService.updateRowElements(dto, rowId, true);
  }
}
