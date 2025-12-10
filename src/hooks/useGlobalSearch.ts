import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/services/search';
import { settingsService } from '@/services/settings';
import { useNavigate } from 'react-router-dom';

export const useGlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: results, isLoading } = useQuery({
    queryKey: ['global-search', query],
    queryFn: () => searchService.globalSearch(query),
    enabled: query.length >= 2 && isOpen,
    staleTime: 30000,
  });

  const searchHistory = settingsService.getSearchHistory();

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setQuery(searchQuery);
      settingsService.addToSearchHistory(searchQuery);
      setIsOpen(true);
    }
  };

  const handleSelectResult = (result: { url: string }) => {
    navigate(result.url);
    setIsOpen(false);
    setQuery('');
  };

  const clearHistory = () => {
    settingsService.clearSearchHistory();
  };

  useEffect(() => {
    if (query.length < 2) {
      setIsOpen(false);
    }
  }, [query]);

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    results: results || [],
    isLoading,
    searchHistory,
    handleSearch,
    handleSelectResult,
    clearHistory,
  };
};





