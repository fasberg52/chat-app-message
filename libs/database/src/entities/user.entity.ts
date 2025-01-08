import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Max, Min } from 'class-validator';

@Entity()
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(255)
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(255)
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  lastName: string;
}
