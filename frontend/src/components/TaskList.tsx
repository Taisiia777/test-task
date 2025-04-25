import { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { Task } from '../types/Task';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: string, completed: boolean) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onCompleteAll?: () => Promise<void>;
}

type FilterType = 'all' | 'active' | 'completed';
type SortDirection = 'asc' | 'desc';

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleStatus, onDeleteTask, onCompleteAll }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [completionPercent, setCompletionPercent] = useState<number>(0);

  // Обновляем отфильтрованные задачи при изменении фильтра или задач
  useEffect(() => {
    let result = [...tasks];
    
    // Применяем фильтр
    if (filter === 'active') {
      result = result.filter(task => !task.completed);
    } else if (filter === 'completed') {
      result = result.filter(task => task.completed);
    }
    
    // Сортировка (по id или createdAt, если оно есть)
    result.sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      const aVal = aDate || a.id;
      const bVal = bDate || b.id;
      
      if (sortDirection === 'asc') {
        return String(aVal).localeCompare(String(bVal));
      } else {
        return String(bVal).localeCompare(String(aVal));
      }
    });
    
    setFilteredTasks(result);
    
    // Расчет процента выполнения
    if (tasks.length > 0) {
      const completed = tasks.filter(task => task.completed).length;
      setCompletionPercent(Math.round((completed / tasks.length) * 100));
    } else {
      setCompletionPercent(0);
    }
  }, [tasks, filter, sortDirection]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (tasks.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        <div className={styles.emptyIcon}>📝</div>
        <p>Задач пока нет. Добавьте вашу первую задачу!</p>
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      {/* Полоса прогресса */}
      <div className="progress-container">
        <div className="progress-bar-bg">
          <div 
            className="progress-bar" 
            style={{ width: `${completionPercent}%` }}
          ></div>
        </div>
        <div className="progress-text">
          <span>Выполнено: {completionPercent}%</span>
          <span>{tasks.filter(task => task.completed).length} из {tasks.length}</span>
        </div>
      </div>

      {/* Заголовок со списком фильтров */}
      <div className={styles.listHeader}>
        <div className={styles.listTitle}>
          Мои задачи
        </div>
        
        <div className={styles.filters}>
          <button 
            className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            Все
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'active' ? styles.filterButtonActive : ''}`}
            onClick={() => handleFilterChange('active')}
          >
            Активные
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'completed' ? styles.filterButtonActive : ''}`}
            onClick={() => handleFilterChange('completed')}
          >
            Завершённые
          </button>
          
          <button 
            className={styles.sortButton + ' ' + (sortDirection === 'asc' ? styles.sortButtonAsc : styles.sortButtonDesc)}
            onClick={toggleSortDirection}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Сортировка
          </button>
        </div>
      </div>

      {/* Кнопка "Завершить все" если есть незавершенные задачи и функция передана */}
      {onCompleteAll && tasks.some(task => !task.completed) && (
        <button 
          className={styles.completeAllButton}
          onClick={onCompleteAll}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Завершить все задачи
        </button>
      )}

      <div className={styles.tasksContainer}>
        {filteredTasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleStatus={onToggleStatus}
            onDeleteTask={onDeleteTask}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;