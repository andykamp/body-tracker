import { useWithingsContext } from '@/withings-client/Provider'
import { useGetAccess } from '@/withings-client/utils';

function GetAccess() {
  const { accessResponse } = useWithingsContext()

  const accessCodeLinkState = useGetAccess({
    enabled: !accessResponse
  })

  if (!accessCodeLinkState) return null;

  const { error, accessCodeLink, isLoading, isFetching } = accessCodeLinkState

  if (error) {
    return <div className="text-red-500">An error occurred</div>
  }

  const showAccessButton = accessCodeLink && !isLoading && !isFetching

  if (!showAccessButton) return <div>whitings data already added</div>;

  return (
    <div>
      < a href={accessCodeLink}>Click here to get access</a>
    </div >
  )
}

export default GetAccess;
