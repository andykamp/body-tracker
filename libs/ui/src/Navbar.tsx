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

type NavbarProps = {
  user?: any,
  navigation: Navigation,
  pathname?: string
  signIn?(): void,
  signOut?(): void
  deleteAccount?(): void
}

export default function Navbar(props: NavbarProps) {
  const { user, pathname, navigation, signIn, signOut, deleteAccount } = props

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <Logo />
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? 'border-slate-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                      )}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
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
        </>
      )}
    </Disclosure>
  );
}

