import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { GetCurrentUserIdDecorator } from 'src/common/decorators/getCurrentUserId.decorator';
import { NoAuth } from 'src/common/decorators/noAuth.decorator';
import { CustomResponseType } from 'src/common/types/customResponseType';
import { Repository } from 'typeorm';
import responseDescriptionConstant from '../../../common/constants/responseDescription.constant';
import { GetCurrentUserPayloadDecorator } from '../../../common/decorators/getCurrentUserPayload.decorator';
import { BadRequestResponse, BadRequestWithErrorResponse } from '../../../common/responses/badRequest.response';
import { ConflictWithErrorResponse } from '../../../common/responses/conflict.response';
import { CreatedResponse } from '../../../common/responses/created.response';
import { ForbiddenWithErrorResponse } from '../../../common/responses/forbidden.response';
import { InternalServerErrorResponse } from '../../../common/responses/internalServerError.response';
import { NotFoundWithErrorResponse } from '../../../common/responses/notFound.response';
import { OkResponse } from '../../../common/responses/ok.response';
import { UnauthorizedResponse } from '../../../common/responses/unauthorized.response';
import { UnprocessableEntityWithErrorResponse } from '../../../common/responses/unprocessableEntityResponse';
import { JwtPayloadWithTimeType } from '../../../common/types/jwtPayloadWithTime.type';
import { LanguageEntity } from '../database/entities/postgres/language.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserLanguageDto } from './dto/createUserLanguage.dto';
import { DeleteUserLanguageDto } from './dto/deleteUserLanguage.dto';
import { RecoverUserPasswordDto } from './dto/recoverUserPassword.dto';
import { SendCodeDto } from './dto/sendCode.dto';
import { SignInDto } from './dto/signIn.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateUserLanguageDto } from './dto/updateUserLanguage.dto';
import { UpdateUserPasswordDto } from './dto/updateUserPassword.dto';
import { UserCodeDto } from './dto/userCode.dto';
import { CheckRecoveryCode404Response } from './responses/checkRecoveryCode.response';
import { CreateUserLanguage200Response } from './responses/languages/createUserLanguage.response';
import { ReadLanguages200Response } from './responses/languages/readLanguages.response';
import { ReadUser200Response } from './responses/readUser.response';
import { RefreshTokens200Response } from './responses/refreshTokens.response';
import { SendUserCode429Response } from './responses/sendUserCode.response';
import { SingIn200Response, SingIn202Response } from './responses/signIn.response';
import { VerifyUser200Response } from './responses/verifyUser.response';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(LanguageEntity)
    private readonly languagesRepository: Repository<LanguageEntity>,
  ) {}

  @ApiOperation({ summary: 'Sign in' })
  @Post('/sign-in')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: SingIn200Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: SingIn202Response,
    description: responseDescriptionConstant.ACCEPTED_CREDENTIALS,
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorResponse,
    description: responseDescriptionConstant.INTERNAL_SERVER_ERROR,
  })
  private async signIn(@Body() dto: SignInDto): Promise<CustomResponseType> {
    return await this.userService.signIn(dto);
  }

  @ApiOperation({ summary: 'Refresh tokens' })
  @Put('/refresh-tokens')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: RefreshTokens200Response,
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
  private async refreshTokens(@GetCurrentUserPayloadDecorator() userJwtPayload: JwtPayloadWithTimeType): Promise<CustomResponseType> {
    return await this.userService.refreshTokens(userJwtPayload);
  }

  @ApiOperation({ summary: 'Create' })
  @Post()
  @NoAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreatedResponse,
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
  private async createUser(@Body() dto: CreateUserDto): Promise<CustomResponseType> {
    return await this.userService.createUser(dto);
  }

  @ApiOperation({ summary: 'User verification' })
  @Post('verify')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: VerifyUser200Response,
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
  private async verifyUser(@Body() dto: UserCodeDto): Promise<CustomResponseType> {
    return await this.userService.verifyUser(dto);
  }

  @ApiOperation({ summary: 'Send code' })
  @Post('send-code')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: NotFoundWithErrorResponse,
    description: responseDescriptionConstant.NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictWithErrorResponse,
    description: responseDescriptionConstant.CONFLICT,
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    type: SendUserCode429Response,
    description: responseDescriptionConstant.TOO_MANY_REQUESTS,
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
  private async sendUserCode(@Body() dto: SendCodeDto): Promise<CustomResponseType> {
    return await this.userService.sendUserCode(dto);
  }

  @ApiOperation({ summary: 'Recover user password' })
  @Post('recovery')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BadRequestWithErrorResponse,
    description: responseDescriptionConstant.BAD_REQUEST,
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
  private async recoverUserPassword(@Body() dto: RecoverUserPasswordDto): Promise<CustomResponseType> {
    return await this.userService.recoverUserPassword(dto);
  }

  @ApiOperation({ summary: 'Check recovery code' })
  @Post('recovery-check')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: CheckRecoveryCode404Response,
    description: responseDescriptionConstant.NOT_FOUND,
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
  private async checkRecoveryCode(@Body() dto: UserCodeDto): Promise<CustomResponseType> {
    return await this.userService.checkRecoveryCode(dto);
  }

  @ApiOperation({ summary: 'Update' })
  @Patch('data')
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
  private async update(@GetCurrentUserIdDecorator() userId: string, @Body() dto: UpdateUserDto): Promise<CustomResponseType> {
    return await this.userService.update(dto, userId);
  }

  /* Language */
  @ApiOperation({ summary: 'Create user language' })
  @Post('data/user-language')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateUserLanguage200Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: NotFoundWithErrorResponse,
    description: responseDescriptionConstant.NOT_FOUND,
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
  private async createUserLanguage(@Body() dto: CreateUserLanguageDto, @GetCurrentUserIdDecorator() userId: string): Promise<CustomResponseType> {
    return await this.userService.createUserLanguage(dto, userId);
  }

  @ApiOperation({ summary: 'Delete user language' })
  @Delete('data/user-language')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
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
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorResponse,
    description: responseDescriptionConstant.INTERNAL_SERVER_ERROR,
  })
  private async deleteUserLanguage(@Body() dto: DeleteUserLanguageDto, @GetCurrentUserIdDecorator() userId: string): Promise<CustomResponseType> {
    return await this.userService.deleteUserLanguage(dto, userId);
  }

  @ApiOperation({ summary: 'Update user language' })
  @Patch('data/user-language')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BadRequestResponse,
    description: responseDescriptionConstant.BAD_REQUEST,
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
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorResponse,
    description: responseDescriptionConstant.INTERNAL_SERVER_ERROR,
  })
  private async updateUserLanguage(@Body() dto: UpdateUserLanguageDto, @GetCurrentUserIdDecorator() userId: string): Promise<CustomResponseType> {
    return await this.userService.updateUserLanguage(dto, userId);
  }

  @ApiOperation({ summary: 'Update user password' })
  @Put('password')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: OkResponse,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BadRequestResponse,
    description: responseDescriptionConstant.BAD_REQUEST,
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
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    type: UnprocessableEntityWithErrorResponse,
    description: responseDescriptionConstant.UNPROCESSABLE_ENTITY,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorResponse,
    description: responseDescriptionConstant.INTERNAL_SERVER_ERROR,
  })
  private async updateUserPassword(@GetCurrentUserIdDecorator() userId: string, @Body() dto: UpdateUserPasswordDto): Promise<CustomResponseType> {
    return await this.userService.updateUserPassword(dto, userId);
  }

  @ApiOperation({ summary: 'Read own user data' })
  @Get('own')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadUser200Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BadRequestResponse,
    description: responseDescriptionConstant.BAD_REQUEST,
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
  private async readUserData(@GetCurrentUserIdDecorator() userId: string): Promise<CustomResponseType> {
    return await this.userService.readUserData(userId);
  }

  @ApiOperation({ summary: 'Get user languages' })
  @Get('languages-list')
  @NoAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReadLanguages200Response,
    description: responseDescriptionConstant.SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorResponse,
    description: responseDescriptionConstant.INTERNAL_SERVER_ERROR,
  })
  private async getLanguages(): Promise<CustomResponseType> {
    return {
      statusCode: HttpStatus.OK,
      data: {
        languages: await this.languagesRepository.find({ order: { code: 'ASC' } }),
      },
    };
  }
}
