import GoogleLoginButton from '@/ui/Button/GoogleLoginButton'
import { Avatar, Popover } from '@geist-ui/core'
import ProfileMenu from './ProfileMenu';
import ProfileAvatar from './ProfileAvatar';

export type ProfileProps = {
  user: any,
  signIn?(): void,
  signOut?(): void,
  deleteAccount?(): void
}

export default function Profile(props: ProfileProps) {
  const { user, signIn, signOut, deleteAccount } = props
  console.log('user',user );

  return (
    <div className="flex">
      {user ?
        <Popover
          content={ProfileMenu({ user, signOut, deleteAccount })}
          placement="bottomEnd"
          hideArrow
        >
          <ProfileAvatar
            className="cursor-pointer"
            user={user}
          />
        </Popover>
        : <GoogleLoginButton signIn={() => signIn?.()} />
      }
    </div>
  );
}

