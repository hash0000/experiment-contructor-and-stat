import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LanguageEntityP } from './language.entity';
import { UserEntityP } from './user.entity';

export enum UserLanguageProficiencyEnum {
  ELEMENTARY = 'A1',
  PRE_INTERMEDIATE = 'A2',
  INTERMEDIATE = 'B1',
  UPPER_INTERMEDIATE = 'B2',
  ADVANCED = 'C1',
  PROFICIENT = 'C2',
  NATIVE = 'N',
}

@Entity({ name: 'UserLanguage' })
@Index(['user', 'language'], { unique: true })
export class UserLanguageEntityP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: UserLanguageProficiencyEnum.ELEMENTARY,
    type: 'char',
    length: 2,
  })
  proficiency: UserLanguageProficiencyEnum;

  @ManyToOne(() => UserEntityP, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Index()
  user: UserEntityP;

  @ManyToOne(() => LanguageEntityP, (language) => language.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Index()
  language: LanguageEntityP;
}
