import Logo from '@/ui/Logo'
import Profile from '@/ui/Profile'
import { Tabs } from '@geist-ui/core';
import ThemeToggle from '../Theme/ThemeToggle';

export type NavigationItem = {
  name: string,
  href: string
}

export type Navigation = NavigationItem[]

export type NavbarProps = {
  user?: any,
  navigation: Navigation,
  onNavigate(href: string): void,
  pathname?: string
  signIn?(): void,
  signOut?(): void
  deleteAccount?(): void
}

function Navbar(props: NavbarProps) {
  const {
    user,
    pathname,
    navigation,
    onNavigate,
    signIn,
    signOut,
    deleteAccount
  } = props

  const changeHandler = (val: string) => onNavigate(val)

  return (
    <nav className="shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">

          <div className="flex">
            <Logo />
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Tabs
                value={pathname}
                onChange={changeHandler}
                hideDivider
                hideBorder
              >
                {navigation.map((item) => (
                  <Tabs.Item
                    label={item.name}
                    value={item.href}
                  />
                ))}
              </Tabs>
            </div>
          </div>

          <div className="flex flex-row gap-1 items-center">
            <ThemeToggle />
            <Profile
              user={user}
              signIn={signIn}
              signOut={signOut}
              deleteAccount={deleteAccount}
            />
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar
