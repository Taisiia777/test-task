import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './tasks.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find(task => task.id === id);
    
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    
    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    if (!createTaskDto.title || createTaskDto.title.trim() === '') {
      throw new Error('Title is required');
    }

    const newTask: Task = {
      id: uuidv4(),
      title: createTaskDto.title.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    this.tasks.push(newTask);
    return newTask;
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Task {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    
    const existingTask = this.tasks[taskIndex];
    
    const updatedTask = {
      ...existingTask,     
      ...updateTaskDto,    
      title: updateTaskDto.title || existingTask.title  
    };
    
    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  remove(id: string): void {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    
    this.tasks.splice(taskIndex, 1);
  }
}