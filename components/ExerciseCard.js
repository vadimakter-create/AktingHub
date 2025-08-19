function ExerciseCard({ exercise, exerciseId, currentUser }) {
  try {
    const [expanded, setExpanded] = React.useState(false);
    const [isLiked, setIsLiked] = React.useState(false);
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [likesCount, setLikesCount] = React.useState(0);

    React.useEffect(() => {
      loadRatings();
      checkFavorite();
    }, [exerciseId, currentUser]);

    const loadRatings = async () => {
      try {
        const ratings = await trickleListObjects('exercise_rating', 100, true);
        const exerciseRatings = ratings.items.filter(r => r.objectData.exerciseId === exerciseId);
        const likes = exerciseRatings.filter(r => r.objectData.rating === 'like').length;
        setLikesCount(likes);
        
        const userRating = exerciseRatings.find(r => r.objectData.userId === currentUser);
        setIsLiked(userRating?.objectData.rating === 'like');
      } catch (error) {
        console.error('Ошибка загрузки рейтингов:', error);
      }
    };

    const checkFavorite = async () => {
      try {
        const favorites = await trickleListObjects('user_favorites', 100, true);
        const userFavorite = favorites.items.find(f => 
          f.objectData.userId === currentUser && f.objectData.exerciseId === exerciseId
        );
        setIsFavorite(!!userFavorite);
      } catch (error) {
        console.error('Ошибка проверки избранного:', error);
      }
    };

    const handleLike = async () => {
      try {
        await trickleCreateObject('exercise_rating', {
          exerciseId,
          userId: currentUser,
          rating: isLiked ? 'dislike' : 'like',
          createdAt: new Date().toISOString()
        });
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      } catch (error) {
        console.error('Ошибка оценки упражнения:', error);
      }
    };

    const handleFavorite = async () => {
      try {
        if (!isFavorite) {
          await trickleCreateObject('user_favorites', {
            userId: currentUser,
            exerciseId,
            addedAt: new Date().toISOString()
          });
          setIsFavorite(true);
        }
      } catch (error) {
        console.error('Ошибка добавления в избранное:', error);
      }
    };

    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case 'beginner': return 'bg-green-100 text-green-800';
        case 'intermediate': return 'bg-yellow-100 text-yellow-800';
        case 'advanced': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getDifficultyText = (difficulty) => {
      switch (difficulty) {
        case 'beginner': return 'Начинающий';
        case 'intermediate': return 'Средний';
        case 'advanced': return 'Продвинутый';
        default: return 'Не указан';
      }
    };

    return (
      <div className="exercise-card" data-name="exercise-card" data-file="components/ExerciseCard.js">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {exercise.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
            {getDifficultyText(exercise.difficulty)}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-1">
            <div className="icon-clock text-base"></div>
            {exercise.duration || '15-30 мин'}
          </div>
          <div className="flex items-center gap-1">
            <div className="icon-users text-base"></div>
            {exercise.participants || 'Индивидуально'}
          </div>
        </div>

        <p className="text-[var(--text-secondary)] mb-3">
          {expanded ? exercise.description : `${exercise.description?.substring(0, 150)}...`}
        </p>

        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[var(--primary-color)] hover:text-purple-700 font-medium text-sm"
          >
            {expanded ? 'Свернуть' : 'Подробнее'}
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="icon-heart text-sm"></div>
              {likesCount}
            </button>
            
            <button
              onClick={handleFavorite}
              className={`p-1 rounded-md ${
                isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              <div className="icon-star text-sm"></div>
            </button>
          </div>
        </div>

        {expanded && exercise.instructions && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-medium mb-2">Инструкция:</h4>
            <div className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
              {exercise.instructions}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ExerciseCard component error:', error);
    return null;
  }
}
