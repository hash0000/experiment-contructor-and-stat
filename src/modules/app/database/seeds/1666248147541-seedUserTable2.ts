import * as argon from 'argon2';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserSexEnum } from '../entities/postgres/user.entity';

export class SeedUserTable216662481415591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "User" (id, "firstName", "lastName", "middleName", email, password, phone, birthday, laboratory,
                           specialization, sex, "isVerified", "createdAt", "updatedAt")
       VALUES (DEFAULT, 'John', 'Depp', 'Christopher', 'mail1@mail.org', '${await this.hashString('F354*43Dfe142F3!')}', null, null, null, null, ${
         UserSexEnum.NOT_KNOWN
       }, true, DEFAULT, DEFAULT);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}

  private async hashString(value: string): Promise<string> {
    const salt = Buffer.from(process.env.SALT, 'utf-8');
    return await argon.hash(value, {
      type: 2,
      salt: salt,
    });
  }
}
