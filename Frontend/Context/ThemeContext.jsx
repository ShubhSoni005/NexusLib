import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const DEFAULT_PREFERENCES = {
  theme: 'dark',
  motion: 'full',
  density: 'comfortable',
  lastPath: '/'
};

export function ThemeProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const oldTheme = localStorage.getItem('nl-theme');
      const saved = localStorage.getItem('nl_preferences');
      let parsed = saved ? JSON.parse(saved) : {};
      
      if (!parsed.theme) {
        if (oldTheme) {
          parsed.theme = oldTheme;
        } else {
          const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
          parsed.theme = prefersLight ? 'light' : 'dark';
        }
      }
      
      if (!parsed.motion) {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        parsed.motion = prefersReduced ? 'reduced' : 'full';
      }
      
      if (!parsed.density) {
        parsed.density = 'comfortable';
      }
      
      if (!parsed.lastPath) {
        parsed.lastPath = window.location.pathname || '/';
      }
      
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  useEffect(() => {
    const { theme, motion, density } = preferences;
    
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-motion', motion);
    document.documentElement.setAttribute('data-density', density);
    
    localStorage.setItem('nl_preferences', JSON.stringify(preferences));
    localStorage.setItem('nl-theme', theme);
  }, [preferences]);

  useEffect(() => {
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionChange = (e) => {
      setPreferences(prev => ({
        ...prev,
        motion: e.matches ? 'reduced' : 'full'
      }));
    };

    motionMediaQuery.addEventListener('change', handleMotionChange);
    return () => {
      motionMediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const setTheme = useCallback((theme) => {
    setPreferences(prev => ({ ...prev, theme }));
  }, []);

  const setMotion = useCallback((motion) => {
    setPreferences(prev => ({ ...prev, motion }));
  }, []);

  const setDensity = useCallback((density) => {
    setPreferences(prev => ({ ...prev, density }));
  }, []);

  const setLastPath = useCallback((lastPath) => {
    setPreferences(prev => ({ ...prev, lastPath }));
  }, []);

  const toggle = useCallback(() => {
    setPreferences(prev => {
      const themes = ['dark', 'light', 'dim', 'amoled'];
      const nextIdx = (themes.indexOf(prev.theme) + 1) % themes.length;
      return { ...prev, theme: themes[nextIdx] };
    });
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme: preferences.theme,
      motion: preferences.motion,
      density: preferences.density,
      lastPath: preferences.lastPath,
      setTheme,
      setMotion,
      setDensity,
      setLastPath,
      toggle
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
