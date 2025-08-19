function AddExerciseForm() {
  try {
    const [formData, setFormData] = React.useState({
      title: '',
      description: '',
      instructions: '',
      category: '',
      difficulty: 'beginner',
      duration: '',
      participants: '',
      author: '',
      musicUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitMessage, setSubmitMessage] = React.useState('');

    const categories = [
      { id: 'stanislavsky', name: 'Система Станиславского' },
      { id: 'chekhov', name: 'Система Михаила Чехова' },
      { id: 'meyerhold', name: 'Биомеханика Мейерхольда' },
      { id: 'meisner', name: 'Техника Мейзнера' },
      { id: 'strasberg', name: 'Метод Страсберга' },
      { id: 'chubbuck', name: 'Техника Чаббак' },
      { id: 'suzuki', name: 'Метод Сузуки' },
      { id: 'lecoq', name: 'Школа Лекока' },
      { id: 'laban', name: 'Система Лабана' },
      { id: 'overlie', name: 'Шесть точек зрения Оверли' },
      { id: 'speech', name: 'Техника речи' },
      { id: 'plastique', name: 'Пластика и движение' },
      { id: 'beginners', name: 'Для начинающих' },
      { id: 'improvisation', name: 'Импровизация' },
      { id: 'emotions', name: 'Работа с эмоциями' }
    ];

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitMessage('');

      try {
        await trickleCreateObject('exercise', {
          ...formData,
          createdAt: new Date().toISOString()
        });
        
        setSubmitMessage('Упражнение успешно добавлено!');
        setFormData({
          title: '',
          description: '',
          instructions: '',
          category: '',
          difficulty: 'beginner',
          duration: '',
          participants: '',
          author: '',
          musicUrl: ''
        });
      } catch (error) {
        setSubmitMessage('Ошибка при добавлении упражнения. Попробуйте еще раз.');
        console.error('Ошибка создания упражнения:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6" data-name="add-exercise-form" data-file="components/AddExerciseForm.js">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Название упражнения *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Введите название упражнения"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Категория *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Краткое описание *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="3"
              className="form-input"
              placeholder="Краткое описание упражнения"
            />
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Подробная инструкция *
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              required
              rows="6"
              className="form-input"
              placeholder="Подробная инструкция выполнения упражнения"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Уровень сложности
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="beginner">Начинающий</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Продолжительность
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="form-input"
                placeholder="15-30 мин"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="participants" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Количество участников
              </label>
              <input
                type="text"
                id="participants"
                name="participants"
                value={formData.participants}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Индивидуально / 2-5 человек"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Автор (необязательно)
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ваше имя"
              />
            </div>
          </div>

          <div>
            <label htmlFor="musicUrl" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Музыка для упражнения (необязательно)
            </label>
            <input
              type="url"
              id="musicUrl"
              name="musicUrl"
              value={formData.musicUrl || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://example.com/music.mp3"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Добавьте ссылку на музыку, которая будет играть во время выполнения упражнения
            </p>
          </div>

          {submitMessage && (
            <div className={`p-4 rounded-lg ${submitMessage.includes('успешно') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submitMessage}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isSubmitting ? 'Добавление...' : 'Добавить упражнение'}
            </button>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    console.error('AddExerciseForm component error:', error);
    return null;
  }
}
