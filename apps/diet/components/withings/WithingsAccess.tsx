import { useWithingsContext } from '../../utils/WithingsProvider';

function WithingsAccess() {
  const { redirectUrlState } = useWithingsContext()
  if (!redirectUrlState) return null;
  const { error, redirectUrl, isLoading, isFetching } = redirectUrlState

  if (error) {
    return <div className="text-red-500">An error occurred</div>
  }

  const showAccessButton = redirectUrl && !isLoading && !isFetching

  return (
    <div>
      {showAccessButton ?
        < a href={redirectUrl}>Click here to get access</a>
        : <div>loading...</div>
      }
    </div >
  )
}

export default WithingsAccess;
