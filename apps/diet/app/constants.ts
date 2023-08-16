import type { Navigation } from '@/ui/Navbar';

export const NAVIGATION_ROUTES_HOME: Navigation = [
];
type RoutesConsole = '/' | '/console' | '/login' | '/console/mealsAndProducts';

export const ROUTES_CONSOLE: Record<string, RoutesConsole> = {
  home: '/',
  console: '/console',
  login: '/login',
  mealsAndProducts: '/console/mealsAndProducts',
}

export const NAVIGATION_ROUTES_CONSOLE: Navigation = [
  { name: 'console', href: ROUTES_CONSOLE.console },
  { name: 'mealsAndProducts', href: ROUTES_CONSOLE.mealsAndProducts },
];

