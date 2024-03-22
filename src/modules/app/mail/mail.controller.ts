import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomResponseType } from 'src/common/types/customResponseType';
import responseDescriptionConstant from '../../../common/constants/responseDescription.constant';
import { NoAuth } from '../../../common/decorators/noAuth.decorator';
import { InternalServerErrorResponse } from '../../../common/responses/internalServerError.response';
import { OkResponse } from '../../../common/responses/ok.response';
import { UnauthorizedResponse } from '../../../common/responses/unauthorized.response';
import { UnprocessableEntityWithErrorResponse } from '../../../common/responses/unprocessableEntityResponse';
import { SendFeedbackDto } from './dto/sendFeedback.dto';
import { MailService } from './mail.service';

@Controller('mail')
@ApiTags('Mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: 'Send feedback' })
  @Post('send-feedback')
  @NoAuth()
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
  private async createSlide(@Body() dto: SendFeedbackDto): Promise<CustomResponseType> {
    await this.mailService.sendFeedback(dto);
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
