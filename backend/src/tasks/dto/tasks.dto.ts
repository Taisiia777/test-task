import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Название задачи',
    example: 'Изучить NestJS',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  title: string;
}

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Название задачи',
    example: 'Изучить NestJS детальнее',
    required: false
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    description: 'Статус выполнения задачи',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}