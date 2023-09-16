import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import GeistProvider from './GeistProvider';
import './global.css';

export const themes = ['light', 'dark'] as const;

export type ThemeType = typeof themes[number];

interface Theme {
  themeType: ThemeType;
  switchTheme: (type: ThemeType) => void;
}

export const ThemeContext = createContext<Theme>({
  themeType: 'dark',
  switchTheme: () => { console.warn('This switchTheme call should be replaced by the ThemeProvider...') }
});

export const useTheme = (): Theme => useContext(ThemeContext);

export type ThemeProviderProps = {
  children: ReactNode
  theme?: ThemeType
}

export function ThemeProvider(props: ThemeProviderProps) {
  const { children, theme = 'light' } = props;
  const [themeType, setThemeType] = useState<ThemeType>(theme);

  const switchTheme = useCallback((theme: ThemeType) => {

    setThemeType(theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.theme = theme
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (
        localStorage.theme === 'dark'
        || (!('theme' in localStorage)
          && window.matchMedia('(prefers-color-scheme: dark)').matches
        )) {
        switchTheme('dark');
      } else {
        switchTheme('light');
      }
    }
  }, [switchTheme]);

  // update on external updates (like storybook)
  useEffect(() => {
    switchTheme(theme);
  }, [theme, switchTheme]);

  return (
    <ThemeContext.Provider value={{ themeType, switchTheme }}>
      <GeistProvider
        themeType={themeType}
      >
        {children}
      </GeistProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider;

