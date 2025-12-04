import { useState, useRef, useEffect } from 'react';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { MagnifyingGlassIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const GlobalSearch = () => {
  const {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    results,
    isLoading,
    searchHistory,
    handleSearch,
    handleSelectResult,
    clearHistory,
  } = useGlobalSearch();

  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product':
        return '📦';
      case 'order':
        return '🛒';
      case 'user':
        return '👤';
      case 'notification':
        return '🔔';
      default:
        return '📄';
    }
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowHistory(e.target.value.length === 0);
              if (e.target.value.length >= 2) {
                setIsOpen(true);
              }
            }}
            onFocus={() => {
              if (query.length === 0 && searchHistory.length > 0) {
                setShowHistory(true);
              } else if (query.length >= 2) {
                setIsOpen(true);
              }
            }}
            placeholder="Search products, orders, users..."
            className="w-full rounded-xl border-2 border-slate-200 bg-white pl-12 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                setShowHistory(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 hover:bg-slate-100 text-slate-400"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {(isOpen || showHistory) && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto rounded-xl border-2 border-primary-100 bg-white shadow-2xl z-50">
          {showHistory && query.length === 0 && searchHistory.length > 0 && (
            <div className="p-4 border-b-2 border-primary-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  Recent Searches
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {searchHistory.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item);
                      handleSearch(item);
                      setShowHistory(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 text-sm text-slate-600 flex items-center gap-2"
                  >
                    <ClockIcon className="h-4 w-4 text-slate-400" />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isOpen && query.length >= 2 && (
            <div className="p-2">
              {isLoading ? (
                <div className="p-4 text-center text-slate-500 text-sm">Searching...</div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectResult(result)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getResultIcon(result.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900 truncate">{result.title}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 capitalize">
                              {result.type}
                            </span>
                          </div>
                          {result.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500 text-sm">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

