import withingsApi from '@/withings/withings.api';
import { useQuery } from '@tanstack/react-query'
import { useUserContext } from "@/diet/utils/UserProvider";
import { useEffect } from 'react';

// redirect timeouts after 30 seconds
const REDIRECT_TIMEOUT = 30 * 1000

function WithingsAccess() {

  const { user } = useUserContext()
  const showGetAuthCode = !!user

  const { data, isError, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getAuthCode'],
    queryFn: () => withingsApi.getAuthCode(),
    enabled: showGetAuthCode
  })

  const redirectUrl = data || null
  console.log('data',data );


  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, REDIRECT_TIMEOUT);

    // clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [refetch]);

  if (isError) {
    return <div className="text-red-500">An error occurred</div>
  }

  const showAccessButton = redirectUrl && !isLoading && !isFetching && !isError

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
