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

function AddExerciseApp() {
  try {
    const handleBackToHome = () => {
      window.location.href = 'index.html';
    };

    return (
      <div className="min-h-screen bg-gray-50" data-name="add-exercise-app" data-file="add-exercise-app.js">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackToHome}
                className="btn-secondary flex items-center gap-2"
              >
                <div className="icon-arrow-left text-lg"></div>
                Назад
              </button>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Добавить упражнение</h1>
                <p className="text-sm text-[var(--text-secondary)]">Поделитесь своим упражнением с сообществом</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <AddExerciseForm />
        </main>
      </div>
    );
  } catch (error) {
    console.error('AddExerciseApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <AddExerciseApp />
  </ErrorBoundary>
);
