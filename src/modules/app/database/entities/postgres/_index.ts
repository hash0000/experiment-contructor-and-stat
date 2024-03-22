import { ExperimentEntityP } from './experiment.entity';
import { LanguageEntityP } from './language.entity';
import { RowEntityP } from './row.entity';
import { CycleChildEntityP, SlideEntityP } from './slide.entity';
import { UserEntityP } from './user.entity';
import { UserCodeEntityP } from './userCode.entity';
import { UserLanguageEntityP } from './userLanguage.entity';

export const postgresEntities = [UserEntityP, LanguageEntityP, UserLanguageEntityP, UserCodeEntityP, ExperimentEntityP, SlideEntityP, CycleChildEntityP, RowEntityP];
