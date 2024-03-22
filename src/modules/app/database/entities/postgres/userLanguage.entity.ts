import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LanguageEntity } from './language.entity';
import { UserEntity } from './user.entity';

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
export class UserLanguageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: UserLanguageProficiencyEnum.ELEMENTARY,
    type: 'char',
    length: 2,
  })
  proficiency: UserLanguageProficiencyEnum;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Index()
  user: UserEntity;

  @ManyToOne(() => LanguageEntity, (language) => language.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Index()
  language: LanguageEntity;
}
