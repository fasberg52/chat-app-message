import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { MessageTypeEnum } from '../enums/message.enum';

export class AddedTypeMessagingTable1736574113827
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'message.messages',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: Object.values(MessageTypeEnum),
        default: `'${MessageTypeEnum.TEXT}'`,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('message.messages', 'type');
  }
}
