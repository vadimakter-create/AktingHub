function Navigation({ activeView, setActiveView, onCategorySelect }) {
  try {
    const [activeTab, setActiveTab] = React.useState('methodology');

    const methodologyCategories = [
      { id: 'stanislavsky', name: 'Станиславский', icon: 'user-circle' },
      { id: 'chekhov', name: 'М. Чехов', icon: 'brain' },
      { id: 'meyerhold', name: 'Мейерхольд', icon: 'activity' },
      { id: 'meisner', name: 'Мейзнер', icon: 'refresh-cw' },
      { id: 'strasberg', name: 'Страсберг', icon: 'eye' },
      { id: 'chubbuck', name: 'Чаббак', icon: 'target' },
      { id: 'suzuki', name: 'Сузуки', icon: 'mountain' },
      { id: 'lecoq', name: 'Лекок', icon: 'mask' },
      { id: 'laban', name: 'Лабан', icon: 'compass' },
      { id: 'overlie', name: 'Оверли', icon: 'hexagon' }
    ];

    const skillsCategories = [
      { id: 'speech', name: 'Речь', icon: 'mic' },
      { id: 'plastique', name: 'Пластика', icon: 'move' },
      { id: 'emotions', name: 'Эмоции', icon: 'heart' },
      { id: 'improvisation', name: 'Импровизация', icon: 'zap' },
      { id: 'attention', name: 'Внимание', icon: 'focus' },
      { id: 'memory', name: 'Память', icon: 'brain-circuit' },
      { id: 'imagination', name: 'Воображение', icon: 'sparkles' },
      { id: 'action', name: 'Действие', icon: 'play' }
    ];

    const participantCategories = [
      { id: 'solo', name: 'Индивидуально', icon: 'user' },
      { id: 'pair', name: 'В паре', icon: 'users' },
      { id: 'group', name: 'В группе', icon: 'users-round' },
      { id: 'observer', name: 'С наблюдателем', icon: 'eye' }
    ];

    return (
      <div className="mb-8" data-name="navigation" data-file="components/Navigation.js">
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('methodology')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'methodology' 
                ? 'bg-white text-[var(--primary-color)] shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            По методикам
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'skills' 
                ? 'bg-white text-[var(--primary-color)] shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            По навыкам
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'participants' 
                ? 'bg-white text-[var(--primary-color)] shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            По участникам
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {(activeTab === 'methodology' ? methodologyCategories : 
            activeTab === 'skills' ? skillsCategories : participantCategories)
            .map(category => (
            <button
              key={category.id}
              onClick={() => onCategorySelect({...category, type: activeTab})}
              className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-[var(--primary-color)] hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <div className={`icon-${category.icon} text-lg text-[var(--primary-color)]`}></div>
              </div>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Navigation component error:', error);
    return null;
  }
}
