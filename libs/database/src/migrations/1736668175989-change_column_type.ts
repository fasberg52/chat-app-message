import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeColumnType1736668175989 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn(
      'notification.notifications',
      'type',
    );
    if (hasColumn) {
      await queryRunner.dropColumn('notification.notifications', 'type');
    }

    await queryRunner.addColumn(
      'notification.notifications',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enumName: 'notification_type_enum',
        enum: ['public', 'private'],
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('notification.notifications', 'type');
  }
}
