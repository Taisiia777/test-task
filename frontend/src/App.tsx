import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Task } from './types/Task';
import './theme.css';

const API_URL = 'http://localhost:3001';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Загрузка задач при первом рендере
  useEffect(() => {
    fetchTasks();
  }, []);

  // Получение списка задач
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Task[]>(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
      toast.error('Не удалось загрузить задачи');
    } finally {
      setIsLoading(false);
    }
  };

  // Добавление новой задачи
  const addTask = async (title: string) => {
    try {
      const newTask = {
        title,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      const response = await axios.post<Task>(`${API_URL}/tasks`, newTask);
      
      // Убедимся, что у полученного ответа есть title, или используем переданный title
      const savedTask = {
        ...response.data,
        title: response.data.title || title
      };
      
      setTasks([savedTask, ...tasks]); // Добавляем в начало списка
      toast.success('Задача успешно добавлена');
      return Promise.resolve();
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error);
      toast.error('Не удалось добавить задачу');
      return Promise.reject(error);
    }
  };

  // Изменение статуса задачи
  const toggleTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      // Находим текущую задачу в массиве
      const currentTask = tasks.find(task => task.id === taskId);
      if (!currentTask) {
        throw new Error('Задача не найдена');
      }
      
      // Отправляем только изменение статуса на сервер
      await axios.patch<Partial<Task>>(`${API_URL}/tasks/${taskId}`, { completed });
      
      // Обновляем состояние локально, не полагаясь на ответ сервера
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, completed } 
            : task
        )
      );
      
      toast.info(completed ? 'Задача отмечена как выполненная' : 'Задача отмечена как невыполненная');
      return Promise.resolve();
    } catch (error) {
      console.error('Ошибка при обновлении статуса задачи:', error);
      toast.error('Не удалось обновить статус задачи');
      return Promise.reject(error);
    }
  };

  // Удаление задачи
  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Задача успешно удалена');
      return Promise.resolve();
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
      toast.error('Не удалось удалить задачу');
      return Promise.reject(error);
    }
  };

  // Завершение всех задач
  const completeAllTasks = async () => {
    const activeTasks = tasks.filter(task => !task.completed);
    
    try {
      // Параллельное выполнение запросов для всех незавершенных задач
      await Promise.all(
        activeTasks.map(task => 
          axios.patch(`${API_URL}/tasks/${task.id}`, { completed: true })
        )
      );
      
      // Обновление состояния после успешных запросов
      setTasks(prevTasks => 
        prevTasks.map(task => ({
          ...task,
          completed: true
        }))
      );
      
      toast.success('Все задачи отмечены как выполненные');
    } catch (error) {
      console.error('Ошибка при обновлении задач:', error);
      toast.error('Не удалось обновить все задачи');
      
      // Перезагружаем задачи при ошибке, чтобы синхронизировать с сервером
      fetchTasks();
    }
  };

  return (
    <div className="todo-app-container">
      <h1 className="app-title">Список задач</h1>
      
      <TaskForm onAddTask={addTask} />
      
      {isLoading ? (
        // Показываем индикатор загрузки
        <div className={`emptyMessage`} style={{textAlign: 'center', padding: '24px'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>⌛</div>
          <p>Загрузка задач...</p>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleStatus={toggleTaskStatus}
          onDeleteTask={deleteTask}
          onCompleteAll={completeAllTasks}
        />
      )}
      
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: 'var(--border-radius-md)',
          boxShadow: 'var(--shadow-md)',
          backdropFilter: 'blur(var(--glass-blur))',
          background: 'var(--card-bg)'
        }}
      />
    </div>
  );
}

export default App;