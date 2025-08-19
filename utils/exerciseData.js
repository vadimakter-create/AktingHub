// Utility functions for exercise data management
const ExerciseData = {
  // Helper function to format exercise data
  formatExercise: (exercise) => {
    return {
      title: exercise.title || '',
      description: exercise.description || '',
      instructions: exercise.instructions || '',
      category: exercise.category || '',
      difficulty: exercise.difficulty || 'beginner',
      duration: exercise.duration || '15-30 мин',
      participants: exercise.participants || 'Индивидуально',
      author: exercise.author || '',
      createdAt: exercise.createdAt || new Date().toISOString()
    };
  },

  // Search exercises by query
  searchExercises: (exercises, query) => {
    if (!query || query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    return exercises.filter(exercise => 
      exercise.objectData.title?.toLowerCase().includes(lowerQuery) ||
      exercise.objectData.description?.toLowerCase().includes(lowerQuery) ||
      exercise.objectData.category?.toLowerCase().includes(lowerQuery) ||
      exercise.objectData.author?.toLowerCase().includes(lowerQuery)
    );
  },

  // Filter exercises by category
  filterByCategory: (exercises, categoryId) => {
    return exercises.filter(exercise => 
      exercise.objectData.category === categoryId
    );
  },

  // Get category name by ID
  getCategoryName: (categoryId) => {
    const categories = {
      'stanislavsky': 'Система Станиславского',
      'chekhov': 'Система Михаила Чехова',
      'meyerhold': 'Биомеханика Мейерхольда',
      'meisner': 'Техника Мейзнера',
      'strasberg': 'Метод Страсберга',
      'chubbuck': 'Техника Чаббак',
      'suzuki': 'Метод Сузуки',
      'lecoq': 'Школа Лекока',
      'laban': 'Система Лабана',
      'overlie': 'Шесть точек зрения Оверли',
      'speech': 'Техника речи',
      'plastique': 'Пластика и движение',
      'beginners': 'Для начинающих',
      'improvisation': 'Импровизация',
      'emotions': 'Работа с эмоциями'
    };
    return categories[categoryId] || categoryId;
  }
};
