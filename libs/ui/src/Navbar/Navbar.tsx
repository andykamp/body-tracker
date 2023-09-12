import { Disclosure } from '@headlessui/react';
import Logo from '@/ui/Logo'
import Profile from '@/ui/Profile'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

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

// @todo: try not to use link here. it is spesific to next... could pass onRoute as a prop and the use next/navigation useRouter?
export default function Navbar(props: NavbarProps) {
  const {
    user,
    pathname,
    navigation,
    onNavigate,
    signIn,
    signOut,
    deleteAccount
  } = props

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <Logo />
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => onNavigate(item.href)}
                    className={classNames(
                      pathname === item.href
                        ? 'border-slate-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hover:cursor-pointer'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            <Profile
              user={user}
              signIn={signIn}
              signOut={signOut}
              deleteAccount={deleteAccount}
            />
          </div>
        </div>
      )}
    </Disclosure>
  );
}

