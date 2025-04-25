import { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  onAddTask: (title: string) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Фокус на инпут при загрузке
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!title.trim()) {
      setError('Пожалуйста, введите название задачи');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Отправка данных
      await onAddTask(title);
      
      // Сброс формы
      setTitle('');
      setError('');
      if (inputRef.current) inputRef.current.focus();
    } catch (err) {
      // Обработка ошибки происходит в родительском компоненте (App.tsx)
      // поэтому здесь ничего не делаем - уведомление уже будет показано
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Добавление задачи по Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Что нужно сделать?"
            className={styles.input}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className={styles.addButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Добавление...' : 'Добавить'}
          </button>
        </div>
        
        {error && (
          <p className={styles.errorMessage}>{error}</p>
        )}
      </div>
    </form>
  );
};

export default TaskForm;