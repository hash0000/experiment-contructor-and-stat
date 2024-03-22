import { ApiProperty } from '@nestjs/swagger';
import {
  accessConditionsConditionEnum,
  accessConditionsOperatorEnum,
  answerTypeEnum,
  ExperimentSaveSettings,
  ExperimentSettingsBasicRespondentData,
} from '../../database/entities/postgres/experiment.entity';

class AccessConditions {
  @ApiProperty()
  id: string;

  @ApiProperty()
  value: string;

  @ApiProperty({ enum: accessConditionsConditionEnum })
  condition: accessConditionsConditionEnum;

  @ApiProperty({ enum: accessConditionsOperatorEnum })
  operator: accessConditionsOperatorEnum;
}

class requestedQuestions {
  @ApiProperty()
  question: string;

  @ApiProperty()
  isRequired: boolean;

  @ApiProperty()
  answerType: answerTypeEnum;

  @ApiProperty()
  answers: string[];
}

class requestedParametersRespondentData {
  @ApiProperty()
  title: string;

  @ApiProperty()
  variableId: string;

  @ApiProperty()
  attributeId: string;
}

export class ExperimentEntityFields {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly saveSettings: ExperimentSaveSettings;

  @ApiProperty()
  readonly requestedBasicRespondentData: ExperimentSettingsBasicRespondentData;

  @ApiProperty({ type: [requestedParametersRespondentData] })
  readonly requestedParametersRespondentData: requestedParametersRespondentData[];

  @ApiProperty({ type: [requestedQuestions] })
  readonly requestedQuestions: requestedQuestions[];

  @ApiProperty({ type: [AccessConditions] })
  readonly accessConditions: AccessConditions[];

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly platform: string;

  @ApiProperty()
  readonly creators: string;

  @ApiProperty()
  readonly status: string;

  @ApiProperty()
  readonly usersStarted: number;

  @ApiProperty()
  readonly usersEnded: number;

  @ApiProperty()
  readonly createdAt: string;

  @ApiProperty()
  readonly updatedAt: string;
}
