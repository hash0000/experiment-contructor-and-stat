import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SetExperimentStatusSensitive } from 'src/common/decorators/setExperimentStatusSensitive.decorator';
import { ValidateObjectIdPipe } from 'src/common/pipes/validateObjectId.pipe';
import { OkResponse } from 'src/common/responses/ok.response';
import { UnauthorizedResponse } from 'src/common/responses/unauthorized.response';
import responseDescriptionConstant from '../../../common/constants/responseDescription.constant';
import { GetCurrentUserIdDecorator } from '../../../common/decorators/getCurrentUserId.decorator';
import { ExperimentAccessGuard } from '../../../common/guards/experimentAccess.guard';
import { ValidationUuidParamPipe } from '../../../common/pipes/validationUuidParam.pipe';
import { ForbiddenWithErrorResponse } from '../../../common/responses/forbidden.response';
import { InternalServerErrorResponse } from '../../../common/responses/internalServerError.response';
import { UnprocessableEntityWithErrorResponse } from '../../../common/responses/unprocessableEntityResponse';
import { CustomResponseType } from '../../../common/types/customResponseType';
import { UserEntityP } from '../database/entities/postgres/user.entity';
import { AddColumnsDto } from './dto/addColumnsDto';
import { AddRowsDto } from './dto/addRowsDto';
import { CreateVariableDto } from './dto/createVariable.dto';
import { DeleteVariableDto } from './dto/deleteVariable.dto';
import { RemoveColumnsDto } from './dto/removeColumns.dto';
import { RemoveRowsDto } from './dto/removeRows.dto';
import { UpdateVariableDto } from './dto/updateVariable.dto';
import { AddVariableColumns200Response } from './responses/addColumns.response';
import { CreateVariable201Response } from './responses/createVariable.response';
import { ReadOneVariable200Response } from './responses/readOneVariable.response';
import { ReadVariables200Response } from './responses/readVariables.response';
import { VariableService } from './variable.service';

@ApiTags('Variable')
@Controller('variable')
export class VariableController {
  constructor(private readonly variableService: VariableService) {}

  @ApiOperation({ summary: 'Create' })
  @Post('/:experimentId')
  @SetExperimentStatusSensitive(true)
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateVariable201Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenWithErrorResponse,
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
  private async create(@Param('experimentId', ValidationUuidParamPipe) experimentId: string, @Body() dto: CreateVariableDto): Promise<CustomResponseType> {
    return await this.variableService.create(dto, experimentId);
  }

  @ApiOperation({ summary: 'Update' })
  @Patch('/:variableId')
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
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenWithErrorResponse,
    description: responseDescriptionConstant.FORBIDDEN,
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
  private async update(
    @GetCurrentUserIdDecorator() userId: UserEntityP['id'],
    @Param('variableId', ValidateObjectIdPipe) variableId: string,
    @Body() dto: UpdateVariableDto,
  ): Promise<CustomResponseType> {
    return await this.variableService.update(dto, userId, variableId);
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenWithErrorResponse,
    description: responseDescriptionConstant.FORBIDDEN,
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
  private async delete(@GetCurrentUserIdDecorator() userId: string, @Body() dto: DeleteVariableDto): Promise<CustomResponseType> {
    return await this.variableService.delete(dto, userId);
  }

  @ApiOperation({ summary: 'Add columns' })
  @Patch('add-columns/:variableId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: AddVariableColumns200Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenWithErrorResponse,
    description: responseDescriptionConstant.FORBIDDEN,
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
  private async addColumns(
    @GetCurrentUserIdDecorator() userId: UserEntityP['id'],
    @Param('variableId', ValidateObjectIdPipe) variableId: string,
    @Body() dto: AddColumnsDto,
  ): Promise<CustomResponseType> {
    return await this.variableService.addColumns(dto, userId, variableId);
  }

  @ApiOperation({ summary: 'Add rows' })
  @Patch('add-rows/:variableId')
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
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenWithErrorResponse,
    description: responseDescriptionConstant.FORBIDDEN,
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
  private async addRows(
    @GetCurrentUserIdDecorator() userId: UserEntityP['id'],
    @Param('variableId', ValidateObjectIdPipe) variableId: string,
    @Body() dto: AddRowsDto,
  ): Promise<CustomResponseType> {
    return await this.variableService.addRows(dto, userId, variableId);
  }

  @ApiOperation({ summary: 'Remove rows' })
  @Delete('remove-rows/:variableId')
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
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenWithErrorResponse,
    description: responseDescriptionConstant.FORBIDDEN,
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
  private async removeRows(
    @GetCurrentUserIdDecorator() userId: UserEntityP['id'],
    @Param('variableId', ValidateObjectIdPipe) variableId: string,
    @Body() dto: RemoveRowsDto,
  ): Promise<CustomResponseType> {
    return await this.variableService.removeRows(dto, userId, variableId);
  }

  @ApiOperation({ summary: 'Remove columns' })
  @Delete('remove-columns/:variableId')
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
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenWithErrorResponse,
    description: responseDescriptionConstant.FORBIDDEN,
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
  private async removeColumns(
    @GetCurrentUserIdDecorator() userId: string,
    @Param('variableId', ValidateObjectIdPipe) variableId: string,
    @Body() dto: RemoveColumnsDto,
  ): Promise<CustomResponseType> {
    return await this.variableService.removeColumns(dto, userId, variableId);
  }

  @ApiOperation({ summary: 'Read many by experiment id (private)' })
  @Get('all/:experimentId')
  @UseGuards(ExperimentAccessGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadVariables200Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenWithErrorResponse,
    description: responseDescriptionConstant.FORBIDDEN,
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
  private async readManyByExperiment(@Param('experimentId', ValidationUuidParamPipe) experimentId: string): Promise<CustomResponseType> {
    return await this.variableService.readManyByExperiment(experimentId);
  }

  @ApiOperation({ summary: 'Read by id (private)' })
  @Get('/:variableId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadOneVariable200Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ForbiddenWithErrorResponse,
    description: responseDescriptionConstant.FORBIDDEN,
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
  private async readById(
    @Param('variableId', ValidateObjectIdPipe) variableId: string,
    @GetCurrentUserIdDecorator() userId: string,
  ): Promise<CustomResponseType> {
    return await this.variableService.readById(variableId, userId);
  }
}
