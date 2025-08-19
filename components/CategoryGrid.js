function CategoryGrid({ onCategorySelect }) {
  try {
    const categories = [
      {
        id: 'stanislavsky',
        name: 'Система Станиславского',
        description: 'Упражнения на эмоциональную память, действие, предлагаемые обстоятельства',
        icon: 'user-circle',
        color: 'bg-blue-100 text-blue-600'
      },
      {
        id: 'chekhov',
        name: 'Система Михаила Чехова',
        description: 'Психологический жест, воображение, атмосфера',
        icon: 'brain',
        color: 'bg-purple-100 text-purple-600'
      },
      {
        id: 'meyerhold',
        name: 'Биомеханика Мейерхольда',
        description: 'Физическая выразительность, ритм, пластика',
        icon: 'activity',
        color: 'bg-green-100 text-green-600'
      },
      {
        id: 'meisner',
        name: 'Техника Мейзнера',
        description: 'Повторение, правдивые реакции, работа с партнером',
        icon: 'refresh-cw',
        color: 'bg-teal-100 text-teal-600'
      },
      {
        id: 'strasberg',
        name: 'Метод Страсберга',
        description: 'Эмоциональная память, сенсорные упражнения, аффективная память',
        icon: 'eye',
        color: 'bg-amber-100 text-amber-600'
      },
      {
        id: 'chubbuck',
        name: 'Техника Чаббак',
        description: 'Двенадцать шагов к правде, работа с целями и препятствиями',
        icon: 'target',
        color: 'bg-rose-100 text-rose-600'
      },
      {
        id: 'suzuki',
        name: 'Метод Сузуки',
        description: 'Концентрация, дисциплина тела, энергия и присутствие',
        icon: 'mountain',
        color: 'bg-slate-100 text-slate-600'
      },
      {
        id: 'lecoq',
        name: 'Школа Лекока',
        description: 'Физический театр, маски, движение и мимика',
        icon: 'mask',
        color: 'bg-emerald-100 text-emerald-600'
      },
      {
        id: 'laban',
        name: 'Система Лабана',
        description: 'Анализ движения, усилие, пространство, время',
        icon: 'compass',
        color: 'bg-cyan-100 text-cyan-600'
      },
      {
        id: 'overlie',
        name: 'Шесть точек зрения Оверли',
        description: 'Пространство, время, форма, жест, эмоция, история',
        icon: 'hexagon',
        color: 'bg-violet-100 text-violet-600'
      },
      {
        id: 'speech',
        name: 'Техника речи',
        description: 'Дикция, дыхание, голосоведение, интонация',
        icon: 'mic',
        color: 'bg-orange-100 text-orange-600'
      },
      {
        id: 'plastique',
        name: 'Пластика и движение',
        description: 'Работа с телом, пространством, координация',
        icon: 'move',
        color: 'bg-pink-100 text-pink-600'
      },
      {
        id: 'beginners',
        name: 'Для начинающих',
        description: 'Базовые упражнения для новичков в актерском мастерстве',
        icon: 'star',
        color: 'bg-yellow-100 text-yellow-600'
      },
      {
        id: 'improvisation',
        name: 'Импровизация',
        description: 'Спонтанность, креативность, работа без сценария',
        icon: 'zap',
        color: 'bg-red-100 text-red-600'
      },
      {
        id: 'emotions',
        name: 'Работа с эмоциями',
        description: 'Эмоциональная подготовка, переживание, выражение чувств',
        icon: 'heart',
        color: 'bg-indigo-100 text-indigo-600'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-name="category-grid" data-file="components/CategoryGrid.js">
        {categories.map(category => (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category)}
            className="category-card"
          >
            <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
              <div className={`icon-${category.icon} text-xl`}></div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
              {category.name}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {category.description}
            </p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('CategoryGrid component error:', error);
    return null;
  }
}
