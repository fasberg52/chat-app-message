import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableNotificationItem1736626959470
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('notification', true);
    await queryRunner.createTable(
      new Table({
        name: 'notificationItems',
        schema: 'notification',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'notificationId',
            type: 'int',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'isRead',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'notification.notificationItems',
      new TableForeignKey({
        columnNames: ['notificationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'notification.notifications',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notification.notificationItems');
    await queryRunner.dropSchema('notification');
    await queryRunner.dropForeignKey(
      'notification.notificationItems',
      'notificationId',
    );
  }
}
