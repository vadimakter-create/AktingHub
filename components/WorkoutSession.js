import React, { useState, useEffect } from 'react';
import './WorkoutSession.css';

const WorkoutSession = ({ onComplete, onReturnHome }) => {
  // Состояния тренировки
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [error, setError] = useState(null);
  
  // Система звезд
  const [totalStars, setTotalStars] = useState(0);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  
  // Настройки уведомлений
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    time: '18:00',
    reminderBefore: 15,
    scheduleType: 'daily',
    specificDates: []
  });
  
  // Загрузка данных при монтировании
  useEffect(() => {
    loadInitialData();
    checkNotificationPermission();
  }, []);

  // Таймер для упражнения
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleExerciseComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Очистка аудио
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  // Загрузка начальных данных
  const loadInitialData = async () => {
    try {
      // Проверка дневного лимита
      const today = new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' });
      const savedStars = localStorage.getItem('dailyStars');
      const lastDate = localStorage.getItem('lastStarDate');
      
      if (lastDate !== today) {
        localStorage.setItem('dailyStars', '0');
        localStorage.setItem('lastStarDate', today);
        setTotalStars(0);
        setDailyLimitReached(false);
      } else {
        const stars = parseInt(savedStars || '0');
        setTotalStars(stars);
        setDailyLimitReached(stars >= 75);
      }

      // Загрузка упражнений
      const exerciseData = await fetchExercises();
      setExercises(exerciseData);

      // Загрузка настроек уведомлений
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        setNotificationSettings(JSON.parse(savedSettings));
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError('Не удалось загрузить данные');
    }
  };

  // Запрос разрешения на уведомления
  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Загрузка упражнений
  const fetchExercises = async () => {
    // Здесь должна быть реальная загрузка данных
    return [
      {
        id: 1,
        title: 'Приседания',
        description: '3 подхода по 15 повторений',
        duration: '3 мин',
        difficulty: 'easy',
        instructions: 'Держите спину прямо, колени не выходят за носки'
      },
      // ... другие упражнения
    ];
  };

  // Начисление звезд
  const addStars = (amount) => {
    if (dailyLimitReached) return;

    const today = new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' });
    const savedStars = localStorage.getItem('dailyStars') || '0';
    let stars = parseInt(savedStars);

    const newTotal = stars + amount;
    if (newTotal >= 75) {
      stars = 75;
      setDailyLimitReached(true);
    } else {
      stars = newTotal;
    }

    localStorage.setItem('dailyStars', stars.toString());
    localStorage.setItem('lastStarDate', today);
    setTotalStars(stars);
  };

  // Начало тренировки
  const startWorkout = () => {
    if (exercises.length > 0) {
      setSessionStarted(true);
      setCurrentIndex(0);
      startCurrentExercise();
    }
  };

  // Запуск текущего упражнения
  const startCurrentExercise = () => {
    const currentExercise = exercises[currentIndex];
    if (!currentExercise) return;

    const duration = parseDuration(currentExercise.duration || '5 мин');
    setTimeLeft(duration);
    setIsRunning(true);
    
    // Воспроизведение музыки
    if (currentExercise.musicUrl) {
      try {
        const audio = new Audio(currentExercise.musicUrl);
        audio.loop = true;
        audio.play().catch(e => console.error('Ошибка воспроизведения:', e));
        setCurrentAudio(audio);
      } catch (err) {
        console.error('Ошибка инициализации аудио:', err);
      }
    }
  };

  // Парсинг длительности
  const parseDuration = (durationStr) => {
    const match = durationStr.match(/(\d+)/);
    return match ? parseInt(match[1]) * 60 : 300;
  };

  // Завершение упражнения
  const handleExerciseComplete = () => {
    setIsRunning(false);
    
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    
    const completedExercise = exercises[currentIndex];
    if (completedExercise) {
      setCompletedExercises(prev => [...prev, completedExercise]);
      
      // Начисление звезд
      const difficulty = completedExercise.difficulty || 'medium';
      const stars = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
      addStars(stars);
    }
    
    if (currentIndex < exercises.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        startCurrentExercise();
      }, 2000);
    } else {
      setShowCongrats(true);
    }
  };

  // Пропуск упражнения
  const skipExercise = () => {
    setIsRunning(false);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      startCurrentExercise();
    } else {
      setShowCongrats(true);
    }
  };

  // Пауза/продолжение
  const pauseResume = () => {
    if (currentAudio) {
      if (isRunning) {
        currentAudio.pause();
      } else {
        currentAudio.play().catch(e => console.error('Ошибка возобновления:', e));
      }
    }
    setIsRunning(!isRunning);
  };

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Сохранение настроек уведомлений
  const saveNotificationSettings = (settings) => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    setNotificationSettings(settings);
    setupNotifications(settings);
  };

  // Настройка уведомлений
  const setupNotifications = (settings) => {
    if ('Notification' in window && settings.enabled) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Здесь должна быть логика планирования уведомлений
          console.log('Уведомления настроены:', settings);
        }
      });
    }
  };

  // Обработка ошибок
  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h1>Ошибка</h1>
          <p>{error}</p>
          <button onClick={loadInitialData}>Повторить попытку</button>
        </div>
      </div>
    );
  }

  // Стартовый экран
  if (!sessionStarted) {
    return (
      <div className="start-screen">
        <div className="start-content">
          <div className="start-icon">🏋️</div>
          <h1>Готовы к тренировке?</h1>
          <p>
            {exercises.length > 0 
              ? `У вас ${exercises.length} упражнений`
              : 'Загрузка...'}
          </p>
          <button 
            onClick={startWorkout} 
            disabled={exercises.length === 0}
          >
            {exercises.length === 0 ? 'Загрузка...' : 'Начать'}
          </button>
          
          <NotificationSettings 
            settings={notificationSettings}
            onSave={saveNotificationSettings}
          />
        </div>
      </div>
    );
  }

  // Текущее упражнение
  const currentExercise = exercises[currentIndex];
  if (!currentExercise) {
    return (
      <div className="error-screen">
        <p>Упражнение не найдено</p>
      </div>
    );
  }

  return (
    <div className="workout-container">
      {/* Индикатор звезд */}
      <div className="stars-indicator">
        <span>⭐ {totalStars}/75</span>
        {dailyLimitReached && <span className="limit-reached">Лимит</span>}
      </div>

      {/* Основной интерфейс тренировки */}
      <div className="exercise-card">
        <div className="exercise-header">
          <div>
            <span className="exercise-count">
              Упражнение {currentIndex + 1} из {exercises.length}
            </span>
            <h1>{currentExercise.title}</h1>
          </div>
          <div className="timer">
            <div className="time-display">{formatTime(timeLeft)}</div>
            <span>осталось</span>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>

        <div className="exercise-content">
          <p>{currentExercise.description}</p>
          
          {currentExercise.instructions && (
            <div className="instructions">
              <h3>Инструкция:</h3>
              <p>{currentExercise.instructions}</p>
            </div>
          )}
        </div>

        <div className="controls">
          <button 
            onClick={pauseResume}
            className={isRunning ? 'pause-btn' : 'resume-btn'}
          >
            {isRunning ? 'Пауза' : 'Продолжить'}
          </button>
          <button onClick={skipExercise} className="skip-btn">
            Пропустить
          </button>
        </div>
      </div>

      {/* Выполненные упражнения */}
      {completedExercises.length > 0 && (
        <div className="completed-exercises">
          <h2>Выполнено:</h2>
          <ul>
            {completedExercises.map((ex, i) => (
              <li key={i}>
                <span>✓</span> {ex.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Поздравительное окно */}
      {showCongrats && (
        <div className="congrats-modal">
          <div className="congrats-content">
            <div className="congrats-icon">🎉</div>
            <h2>Тренировка завершена!</h2>
            <p>Вы заработали {totalStars} звёзд сегодня</p>
            <button onClick={onReturnHome}>На главную</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент настроек уведомлений
const NotificationSettings = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [dateInput, setDateInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addSpecificDate = () => {
    if (dateInput && !localSettings.specificDates.includes(dateInput)) {
      const newDates = [...localSettings.specificDates, dateInput];
      setLocalSettings(prev => ({ ...prev, specificDates: newDates }));
      setDateInput('');
    }
  };

  const removeDate = (date) => {
    const newDates = localSettings.specificDates.filter(d => d !== date);
    setLocalSettings(prev => ({ ...prev, specificDates: newDates }));
  };

  return (
    <div className="notification-settings">
      <h3>Настройки напоминаний</h3>
      
      <label>
        <input
          type="checkbox"
          name="enabled"
          checked={localSettings.enabled}
          onChange={handleChange}
        />
        Включить уведомления
      </label>

      <div className="setting-group">
        <label>Время напоминания:</label>
        <input
          type="time"
          name="time"
          value={localSettings.time}
          onChange={handleChange}
          disabled={!localSettings.enabled}
        />
      </div>

      <div className="setting-group">
        <label>Напоминать за:</label>
        <select
          name="reminderBefore"
          value={localSettings.reminderBefore}
          onChange={handleChange}
          disabled={!localSettings.enabled}
        >
          {[5, 15, 30, 60].map(min => (
            <option key={min} value={min}>{min} минут</option>
          ))}
        </select>
      </div>

      <div className="setting-group">
        <label>Расписание:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="scheduleType"
              value="daily"
              checked={localSettings.scheduleType === 'daily'}
              onChange={handleChange}
              disabled={!localSettings.enabled}
            />
            Ежедневно
          </label>
          <label>
            <input
              type="radio"
              name="scheduleType"
              value="specific"
              checked={localSettings.scheduleType === 'specific'}
              onChange={handleChange}
              disabled={!localSettings.enabled}
            />
            Конкретные даты
          </label>
        </div>
      </div>

      {localSettings.scheduleType === 'specific' && (
        <div className="specific-dates">
          <label>Добавить дату:</label>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            disabled={!localSettings.enabled}
          />
          <button 
            onClick={addSpecificDate}
            disabled={!dateInput || !localSettings.enabled}
          >
            Добавить
          </button>

          <div className="dates-list">
            {localSettings.specificDates.map(date => (
              <div key={date} className="date-tag">
                {date}
                <button onClick={() => removeDate(date)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={() => onSave(localSettings)}
        className="save-settings-btn"
      >
        Сохранить настройки
      </button>
    </div>
  );
};

export default WorkoutSession;
