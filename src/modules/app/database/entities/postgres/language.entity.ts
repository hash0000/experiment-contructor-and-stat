import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Language' })
export class LanguageEntityP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  code: string;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  native: string;

  @Column({
    nullable: false,
  })
  region: string;
}
