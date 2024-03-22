import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntityP } from './user.entity';

export enum CodeTypeEnum {
  RECOVER = 'recover',
  VERIFICATION = 'verification',
}

@Entity({ name: 'UserCode' })
export class UserCodeEntityP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  value: string;

  @Column({
    nullable: false,
  })
  type: CodeTypeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntityP, (User) => User.id, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Index()
  user: UserEntityP;
}
