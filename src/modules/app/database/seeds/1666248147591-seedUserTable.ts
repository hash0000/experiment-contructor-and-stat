import * as argon from 'argon2';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserSexEnum } from '../entities/postgres/user.entity';

export class SeedUserTable1666248147591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "User" (id, "firstName", "lastName", "middleName", email, password, phone, birthday, laboratory,
                           specialization, sex, "isVerified", "createdAt", "updatedAt")
       VALUES (DEFAULT, 'John', 'Depp', 'Christopher', 'mail@mail.org', '${await this.hashString('root123-')}', null, null, null, null, ${
        UserSexEnum.NOT_KNOWN
      }, true, DEFAULT, DEFAULT);

      INSERT INTO "User" (id, "firstName", "lastName", email, password, phone, birthday, laboratory,
                          specialization, sex, "isVerified", "createdAt", "updatedAt")
      VALUES (DEFAULT, 'Egor', 'Saipsaev', 'esaispaev@yandex.ru', '${await this.hashString('Saispaev1!')}', null, null, null, null, ${
        UserSexEnum.NOT_KNOWN
      }, true, DEFAULT, DEFAULT);

      INSERT INTO "User" (id, "firstName", "lastName", email, password, phone, birthday, laboratory,
                          specialization, sex, "isVerified", "createdAt", "updatedAt")
      VALUES (DEFAULT, 'Nikita', 'Lysov', 'test@test.test', '${await this.hashString('test1-')}', null, null, null, null, ${
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
