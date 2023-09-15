import { Avatar } from '@geist-ui/core'
import { ComponentProps } from 'react';

function getInitials(name: string) {
  return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
}

export type ProfileAvatarProps = ComponentProps<'div'> & {
  user: any,
}

export default function ProfileAvatar(props: ProfileAvatarProps) {
  const { user, className } = props

  const initials = getInitials(user.displayName)
  return (
    <div
      className={className}
    >
      <Avatar text={initials} />
    </div>
  );
}
