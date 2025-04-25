import { useState, useRef, useEffect } from 'react';
import { Task } from '../types/Task';
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, completed: boolean) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  index: number; // добавляем индекс для анимации
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleStatus, onDeleteTask, index }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Анимация появления с задержкой
  useEffect(() => {
    if (itemRef.current) {
      itemRef.current.style.animationDelay = `${index * 0.05}s`;
    }
  }, [index]);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggleStatus(task.id, !task.completed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setIsDeleting(true);
    
    // Анимация удаления
    if (itemRef.current) {
      itemRef.current.style.transform = 'translateX(10%)';
      itemRef.current.style.opacity = '0';
    }
    
    // Задержка для анимации
    setTimeout(async () => {
      try {
        await onDeleteTask(task.id);
      } finally {
        setIsLoading(false);
        setIsDeleting(false);
      }
    }, 300);
  };

  const taskItemClassName = `${styles.taskItem} 
    ${task.completed ? styles.completed : ''} 
    ${isLoading ? styles.loading : ''}`;

  const taskTitleClassName = `${styles.taskTitle} 
    ${task.completed ? styles.taskTitleCompleted : ''}`;
    
  // Получаем дату создания (можно получать из task, если есть createdAt)
  const createdAt = new Date().toLocaleDateString('ru-RU');



  return (
    <div 
      className={taskItemClassName}
      ref={itemRef}
      style={{ 
        pointerEvents: isDeleting ? 'none' : 'auto',
        transition: isDeleting ? 'all 0.3s ease' : undefined 
      }}
    >
      
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        disabled={isLoading}
        className={styles.checkbox}
      />
      
      <div className={styles.taskContent}>
        <p className={taskTitleClassName}>
          {task.title}
        </p>
        <div className={styles.taskMeta}>
          Добавлено: {createdAt}
        </div>
      </div>
      
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className={styles.deleteButton}
        aria-label="Удалить задачу"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default TaskItem;