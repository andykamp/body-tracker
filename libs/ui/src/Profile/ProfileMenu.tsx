import { Popover, Button } from '@geist-ui/core'

type ProfileMenuProps = {
  user: any,
  signOut?(): void,
  deleteAccount?(): void
}

function ProfileMenu(props: ProfileMenuProps) {
  const {
    user,
    signOut,
    deleteAccount
  } = props

  return (
    <>
      <Popover.Item disableAutoClose >
        <span>{user?.email}</span>
      </Popover.Item>

      <Popover.Item line />

      <Popover.Item
      >
        <div
          className="w-full cursor-pointer"
        >
          User Settings
        </div>
      </Popover.Item>

      <Popover.Item>
        <div
          className="w-full cursor-pointer hover:bg-accent1"
          onClick={() => signOut?.()}
        >
          Sign out
        </div>

      </Popover.Item>

      <Popover.Item line />

      <Popover.Item >
        <Button
          className="!w-full"
          type="error"
          onClick={() => deleteAccount?.()}
        >
          Delete Account
        </Button>

      </Popover.Item>
    </>
  )
}

export default ProfileMenu

/*
.item.hover.active.jsx-414771587, .item.hover.jsx-414771587:not(.disabled):hover {
  background: var(--ds-gray-alpha-100);
  cursor: pointer;
}

<style>
.item.jsx-414771587:not(.disabled):hover, .item.active.jsx-414771587 {
  color: var(--geist-foreground);
}
*/
