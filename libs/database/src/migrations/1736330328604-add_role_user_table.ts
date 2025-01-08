import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { UserRoleEunm } from '..';

export class AddRoleUserTable1736330328604 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = 'user';
    const table = 'users';
    await queryRunner.addColumn(
      `${schema}.${table}`,
      new TableColumn({
        name: 'role',
        type: 'enum',
        enum: Object.values(UserRoleEunm),
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user.users', 'role');
  }
}
