function SearchBar({ searchQuery, setSearchQuery, exercises }) {
  try {
    const [suggestions, setSuggestions] = React.useState([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);

    React.useEffect(() => {
      if (searchQuery.length > 2) {
        const filtered = exercises
          .filter(ex => 
            ex.objectData.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ex.objectData.category?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5);
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, [searchQuery, exercises]);

    const handleSuggestionClick = (suggestion) => {
      setSearchQuery(suggestion.objectData.title);
      setShowSuggestions(false);
    };

    return (
      <div className="relative max-w-2xl mx-auto mb-8" data-name="search-bar" data-file="components/SearchBar.js">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="icon-search text-xl text-[var(--text-secondary)]"></div>
          </div>
          <input
            type="text"
            placeholder="Поиск упражнений, методик, категорий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
            {suggestions.map(suggestion => (
              <div
                key={suggestion.objectId}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium">{suggestion.objectData.title}</div>
                <div className="text-sm text-[var(--text-secondary)]">{suggestion.objectData.category}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('SearchBar component error:', error);
    return null;
  }
}
