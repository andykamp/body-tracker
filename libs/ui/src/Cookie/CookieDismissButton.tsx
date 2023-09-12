import Cookies from 'js-cookie';

type CookieDismissButtonProps = {
  dismissText?: string
  onDismiss: () => void
}
export default function CookieDismissButton(props: CookieDismissButtonProps) {
  const {
    dismissText = 'Dismiss →',
    onDismiss,
  } = props

  return (
    <button
      className="contents underline text-blue-600"
      onClick={() => {
        Cookies.set('template-banner-hidden', 'true');
        onDismiss();
      }}
    >
      {dismissText}
    </button>
  );
}

