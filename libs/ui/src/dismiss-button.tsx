import Cookies from 'js-cookie';

export default function DismissButton() {

  return (
    <button
      className="contents underline text-blue-600"
      onClick={() => {
        Cookies.set('template-banner-hidden', 'true');
        // router.refresh();
      }}
    >
      Dismiss →
    </button>
  );
}
