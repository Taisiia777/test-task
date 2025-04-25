import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ 
    description: 'Уникальный идентификатор задачи',
    example: '55b33264-3c11-4568-a23e-4c90e1488614'
  })
  id: string;

  @ApiProperty({ 
    description: 'Название задачи',
    example: 'Изучить NestJS'
  })
  title: string;

  @ApiProperty({ 
    description: 'Статус выполнения задачи',
    example: false,
    default: false
  })
  completed: boolean;

  @ApiProperty({ 
    description: 'Дата создания задачи',
    example: '2023-10-20T12:00:00Z'
  })
  createdAt: Date;
}