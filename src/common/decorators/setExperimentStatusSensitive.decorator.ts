import { SetMetadata } from '@nestjs/common';

export const SetExperimentStatusSensitive = (statusSensitive: boolean) => SetMetadata('statusSensitive', statusSensitive);
