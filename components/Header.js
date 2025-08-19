function Header({ activeView, setActiveView, userProfile }) {
  try {
    const handleAddExercise = () => {
      window.location.href = 'add-exercise.html';
    };

    const handleLogoClick = () => {
      setActiveView('home');
    };

    return (
      <header className="bg-white shadow-sm border-b" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={handleLogoClick}
            >
              <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                <div className="icon-theater text-xl text-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">ActingHub</h1>
                <p className="text-sm text-[var(--text-secondary)]">База актерских упражнений</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleAddExercise}
                className="btn-secondary flex items-center gap-2"
              >
                <div className="icon-plus text-lg"></div>
                Добавить упражнение
              </button>
              
              {userProfile && (
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg"
                  onClick={() => setActiveView('profile')}
                >
                  <div className="w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
                    <div className="icon-user text-sm text-white"></div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{userProfile.objectData.username}</p>
                    <div className="flex items-center gap-1">
                      <div className="icon-star text-xs text-[var(--accent-color)]"></div>
                      <span className="text-xs text-[var(--text-secondary)]">{userProfile.objectData.stars}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
