import { Controller, Get, Post, Body, Param, Delete, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { Task } from './tasks.entity';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все задачи' })
  @ApiOkResponse({ 
    description: 'Список всех задач',
    type: [Task]
  })
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить задачу по ID' })
  @ApiParam({ name: 'id', description: 'ID задачи' })
  @ApiOkResponse({ 
    description: 'Задача найдена',
    type: Task
  })
  findOne(@Param('id') id: string): Task {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую задачу' })
  @ApiCreatedResponse({ 
    description: 'Задача успешно создана',
    type: Task
  })
  create(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить задачу' })
  @ApiParam({ name: 'id', description: 'ID задачи' })
  @ApiOkResponse({ 
    description: 'Задача успешно обновлена',
    type: Task
  })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Task {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить задачу' })
  @ApiParam({ name: 'id', description: 'ID задачи' })
  @ApiNoContentResponse({ description: 'Задача успешно удалена' })
  remove(@Param('id') id: string): void {
    this.tasksService.remove(id);
  }
}