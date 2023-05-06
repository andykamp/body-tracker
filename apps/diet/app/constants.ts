import type { Navigation } from '@/ui/Navbar';

export const NAVIGATION_ROUTES_HOME: Navigation = [
];
type RoutesConsole = '/' | 'console' | 'console/daily';

export const ROUTES_CONSOLE: Record<string, RoutesConsole> = {
  home: '/',
  console: 'console',
  daily: 'console/daily',
}
export const NAVIGATION_ROUTES_CONSOLE: Navigation = [
  { name: 'home', href: ROUTES_CONSOLE.home },
  { name: 'console', href: ROUTES_CONSOLE.console },
  { name: 'daily', href: ROUTES_CONSOLE.daily },
];
