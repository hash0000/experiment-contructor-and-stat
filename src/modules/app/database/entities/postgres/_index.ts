import { ExperimentEntity } from './experiment.entity';
import { LanguageEntity } from './language.entity';
import { RowEntity } from './row.entity';
import { CycleChildEntity, SlideEntity } from './slide.entity';
import { UserEntity } from './user.entity';
import { UserCodeEntity } from './userCode.entity';
import { UserLanguageEntity } from './userLanguage.entity';

export const postgresEntities = [UserEntity, LanguageEntity, UserLanguageEntity, UserCodeEntity, ExperimentEntity, SlideEntity, CycleChildEntity, RowEntity];
