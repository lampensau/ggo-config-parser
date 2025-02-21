import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export const useThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return {
    theme,
    mounted,
    toggleTheme
  };
}; 