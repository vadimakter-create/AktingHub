function UserProfile({ userProfile }) {
  try {
    const [notifications, setNotifications] = React.useState(true);
    const [reminderTime, setReminderTime] = React.useState('18:00');

    React.useEffect(() => {
      if (userProfile?.objectData.preferences) {
        try {
          const prefs = JSON.parse(userProfile.objectData.preferences);
          setNotifications(prefs.notifications || true);
          setReminderTime(prefs.reminderTime || '18:00');
        } catch (error) {
          console.error('Ошибка парсинга настроек:', error);
        }
      }
    }, [userProfile]);

    const getStarLevel = (stars) => {
      if (stars >= 100) return 'Мастер актерского дела';
      if (stars >= 50) return 'Опытный актер';
      if (stars >= 20) return 'Развивающийся актер';
      return 'Начинающий актер';
    };

    const getNextLevelStars = (stars) => {
      if (stars < 20) return 20;
      if (stars < 50) return 50;
      if (stars < 100) return 100;
      return 100;
    };

    const getProgressPercentage = (stars) => {
      const nextLevel = getNextLevelStars(stars);
      const prevLevel = nextLevel === 20 ? 0 : nextLevel === 50 ? 20 : nextLevel === 100 ? 50 : 100;
      return ((stars - prevLevel) / (nextLevel - prevLevel)) * 100;
    };

    if (!userProfile) {
      return (
        <div className="text-center py-12">
          <div className="icon-user text-6xl text-gray-300 mb-4"></div>
          <p className="text-gray-500">Загрузка профиля...</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto" data-name="user-profile" data-file="components/UserProfile.js">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
              <div className="icon-user text-3xl text-white"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                {userProfile.objectData.username}
              </h1>
              <p className="text-[var(--text-secondary)] mb-2">{userProfile.objectData.email}</p>
              <div className="flex items-center gap-2">
                <div className="icon-star text-lg text-[var(--accent-color)]"></div>
                <span className="text-lg font-semibold">{userProfile.objectData.stars} звезд</span>
                <span className="text-sm text-[var(--text-secondary)]">
                  • {getStarLevel(userProfile.objectData.stars)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Прогресс до следующего уровня</span>
              <span className="text-sm text-[var(--text-secondary)]">
                {userProfile.objectData.stars}/{getNextLevelStars(userProfile.objectData.stars)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[var(--primary-color)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(userProfile.objectData.stars)}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <button 
              onClick={() => window.location.href = 'workout.html'}
              className="w-full bg-gradient-to-r from-[var(--primary-color)] to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-purple-700 transition-all"
            >
              <div className="icon-play text-xl mr-3"></div>
              Начать тренировку
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="icon-trophy text-2xl text-blue-600 mb-2"></div>
              <div className="text-lg font-semibold text-blue-800">Достижения</div>
              <div className="text-sm text-blue-600">Скоро появятся</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="icon-target text-2xl text-green-600 mb-2"></div>
              <div className="text-lg font-semibold text-green-800">Цели</div>
              <div className="text-sm text-green-600">Ежедневная практика</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="icon-calendar text-2xl text-purple-600 mb-2"></div>
              <div className="text-lg font-semibold text-purple-800">Активность</div>
              <div className="text-sm text-purple-600">7 дней подряд</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Обмен звезд</h2>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="icon-gift text-2xl text-orange-600"></div>
              <div>
                <h3 className="font-semibold text-orange-800">Специальное предложение!</h3>
                <p className="text-sm text-orange-600">Обменяй звезды на билет в театр!</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-700">Стоимость: 100 звезд</span>
              <button 
                disabled={userProfile.objectData.stars < 100}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Обменять
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Настройки уведомлений</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Напоминания о тренировках</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Получать уведомления о ежедневных упражнениях
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Время напоминания</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Когда присылать уведомления
                </p>
              </div>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('UserProfile component error:', error);
    return null;
  }
}
