import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ContentItem, mockContent } from '../data/mockData';
import { fetchBloggerPosts } from '../services/blogger';

interface AppContextType {
  catalog: ContentItem[];
  myList: ContentItem[];
  history: ContentItem[];
  isLoading: boolean;
  addToMyList: (item: ContentItem) => void;
  removeFromMyList: (itemId: string) => void;
  isInMyList: (itemId: string) => boolean;
  addToHistory: (item: ContentItem) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<ContentItem[]>(mockContent); // Fallback to mock data initially
  const [isLoading, setIsLoading] = useState(true);
  const [myList, setMyList] = useState<ContentItem[]>([]);
  const [history, setHistory] = useState<ContentItem[]>([]);

  useEffect(() => {
    // Load local storage
    const storedList = localStorage.getItem('driveAnimesMyList');
    const storedHistory = localStorage.getItem('driveAnimesHistory');
    if (storedList) setMyList(JSON.parse(storedList));
    if (storedHistory) setHistory(JSON.parse(storedHistory));

    // Fetch real posts from Blogger
    const loadBloggerFeed = async () => {
      try {
        const posts = await fetchBloggerPosts();
        if (posts.length > 0) {
          setCatalog(posts); // Overwrite mock content with real site posts
        }
      } catch (error) {
        console.error("Could not load blogger posts", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBloggerFeed();
  }, []);

  const addToMyList = useCallback((item: ContentItem) => {
    setMyList((prev) => {
      const next = [...prev, item];
      localStorage.setItem('driveAnimesMyList', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromMyList = useCallback((itemId: string) => {
    setMyList((prev) => {
      const next = prev.filter((i) => i.id !== itemId);
      localStorage.setItem('driveAnimesMyList', JSON.stringify(next));
      return next;
    });
  }, []);

  const isInMyList = useCallback((itemId: string) => {
    return myList.some((i) => i.id === itemId);
  }, [myList]);

  const addToHistory = useCallback((item: ContentItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      const next = [item, ...filtered].slice(0, 20); // Keep last 20
      localStorage.setItem('driveAnimesHistory', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        catalog,
        myList,
        history,
        isLoading,
        addToMyList,
        removeFromMyList,
        isInMyList,
        addToHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
