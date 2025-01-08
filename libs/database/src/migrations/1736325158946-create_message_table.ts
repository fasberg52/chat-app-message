import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMessageTable1736325158946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = 'message';

    await queryRunner.createSchema(schema, true);

    await queryRunner.createTable(
      new Table({
        name: 'messages',
        schema: schema,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'senderId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'receiverId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
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
    );

    await queryRunner.createForeignKey(
      'message.messages',
      new TableForeignKey({
        columnNames: ['senderId'],
        referencedTableName: 'user.users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'message.messages',
      new TableForeignKey({
        columnNames: ['receiverId'],
        referencedTableName: 'user.users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropForeignKey('message.messages', 'set-name');
    // await queryRunner.dropForeignKey('message.messages','set-name');
    await queryRunner.dropTable('message.messages');
    await queryRunner.dropSchema('message');
  }
}
