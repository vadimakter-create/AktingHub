class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Что-то пошло не так</h1>
            <p className="text-gray-600 mb-4">Извините, произошла непредвиденная ошибка.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [activeView, setActiveView] = React.useState('home');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [exercises, setExercises] = React.useState([]);
    const [userProfile, setUserProfile] = React.useState(null);
    const [currentUser] = React.useState('demo-user-1');
    const [sortBy, setSortBy] = React.useState('newest');

    React.useEffect(() => {
      loadExercises();
      loadUserProfile();
    }, []);

    const loadExercises = async () => {
      try {
        const exerciseData = await trickleListObjects('exercise', 50, true);
        setExercises(exerciseData.items || []);
      } catch (error) {
        console.error('Ошибка загрузки упражнений:', error);
      }
    };

    const loadUserProfile = async () => {
      try {
        const profiles = await trickleListObjects('user_profile', 1, true);
        if (profiles.items.length > 0) {
          setUserProfile(profiles.items[0]);
        }
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
    };

    const handleCategorySelect = (category) => {
      setSelectedCategory(category);
    };

    const handleBackToCategories = () => {
      setSelectedCategory(null);
      setSearchQuery('');
    };

    const getFilteredExercises = () => {
      if (!selectedCategory) return [];
      
      let filtered = exercises.filter(ex => {
        if (selectedCategory.type === 'methodology') {
          return ex.objectData.category === selectedCategory.id;
        } else if (selectedCategory.type === 'skills') {
          return ex.objectData.skills?.includes(selectedCategory.id) || 
                 ex.objectData.category === selectedCategory.id;
        } else if (selectedCategory.type === 'participants') {
          const participants = ex.objectData.participants?.toLowerCase() || '';
          if (selectedCategory.id === 'solo') return participants.includes('индивидуально');
          if (selectedCategory.id === 'pair') return participants.includes('пар');
          if (selectedCategory.id === 'group') return participants.includes('групп');
          if (selectedCategory.id === 'observer') return participants.includes('наблюдател');
        }
        return false;
      });

      // Apply sorting
      return filtered.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'difficulty':
            const diffOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
            return diffOrder[a.objectData.difficulty] - diffOrder[b.objectData.difficulty];
          case 'stars':
            const starsA = a.objectData.difficulty === 'advanced' ? 3 : a.objectData.difficulty === 'intermediate' ? 2 : 1;
            const starsB = b.objectData.difficulty === 'advanced' ? 3 : b.objectData.difficulty === 'intermediate' ? 2 : 1;
            return starsB - starsA;
          default:
            return 0;
        }
      });
    };

    const renderContent = () => {
      if (activeView === 'profile') {
        return <UserProfile userProfile={userProfile} />;
      }

      if (activeView === 'favorites') {
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Избранные упражнения</h1>
            <p className="text-[var(--text-secondary)] mb-8">Ваши любимые упражнения для быстрого доступа</p>
            <div className="text-center py-12">
              <div className="icon-heart text-6xl text-gray-300 mb-4"></div>
              <p className="text-gray-500">Добавьте упражнения в избранное для быстрого доступа</p>
            </div>
          </div>
        );
      }

      if (activeView === 'collections') {
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Мои подборки</h1>
              <button className="btn-primary">Создать подборку</button>
            </div>
            <div className="text-center py-12">
              <div className="icon-folder text-6xl text-gray-300 mb-4"></div>
              <p className="text-gray-500">Создайте свои подборки упражнений для тренировок</p>
            </div>
          </div>
        );
      }

      // Home view
      if (!selectedCategory) {
        return (
          <div>
            <Navigation 
              activeView={activeView} 
              setActiveView={setActiveView}
              onCategorySelect={handleCategorySelect}
            />
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
                База упражнений по актерскому мастерству
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Собрание упражнений по методикам великих режиссеров и педагогов театра
              </p>
            </div>

            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              exercises={exercises}
            />

            {searchQuery ? (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Результаты поиска</h2>
                <div className="grid gap-4">
                  {exercises
                    .filter(ex => 
                      ex.objectData.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      ex.objectData.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      ex.objectData.category?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(exercise => (
                      <ExerciseCard 
                        key={exercise.objectId} 
                        exercise={exercise.objectData}
                        exerciseId={exercise.objectId}
                        currentUser={currentUser}
                      />
                    ))
                  }
                </div>
              </div>
            ) : (
              <CategoryGrid onCategorySelect={handleCategorySelect} />
            )}
          </div>
        );
      } else {
        return (
          <div>
            <button 
              onClick={handleBackToCategories}
              className="btn-secondary mb-6 flex items-center gap-2"
            >
              <div className="icon-arrow-left text-lg"></div>
              Назад к категориям
            </button>
            
            <h1 className="text-3xl font-bold mb-6">{selectedCategory.name}</h1>
            <p className="text-[var(--text-secondary)] mb-8">{selectedCategory.description}</p>
            
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">
                Найдено упражнений: {getFilteredExercises().length}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="newest">По новизне</option>
                <option value="popular">По популярности</option>
                <option value="difficulty">По сложности</option>
                <option value="stars">По звездам</option>
              </select>
            </div>
            
            <div className="grid gap-4">
              {getFilteredExercises().map(exercise => (
                <ExerciseCard 
                  key={exercise.objectId} 
                  exercise={exercise.objectData}
                  exerciseId={exercise.objectId}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </div>
        );
      }
    };

    return (
      <div className="min-h-screen bg-gray-50" data-name="app" data-file="app.js">
        <Header 
          activeView={activeView} 
          setActiveView={setActiveView}
          userProfile={userProfile}
        />
        
        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
