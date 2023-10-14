import type { Navigation } from '@/ui/Navbar';

export const NAVIGATION_ROUTES_HOME: Navigation = [
];
type RoutesConsole = '/' | '/console' | '/login' | '/console/mealsAndProducts' | '/console/chat';

export const ROUTES_CONSOLE: Record<string, RoutesConsole> = {
  home: '/',
  console: '/console',
  login: '/login',
  mealsAndProducts: '/console/mealsAndProducts',
  chat: '/console/chat',
}

export const NAVIGATION_ROUTES_CONSOLE: Navigation = [
  { name: 'console', href: ROUTES_CONSOLE.console },
  { name: 'mealsAndProducts', href: ROUTES_CONSOLE.mealsAndProducts },
  { name: 'chat', href: ROUTES_CONSOLE.chat },
];

