import { SetMetadata } from '@nestjs/common';
import { ExperimentAccessByEnum } from '../enums/experimentAccessBy.enum';

export const SetExperimentAccessBy = (experimentAccessBy: ExperimentAccessByEnum) => SetMetadata('experimentAccessBy', experimentAccessBy);
