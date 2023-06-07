import Page from "@/ui/Page";
import useQueryParams from '@/common/utils/utils.queryParams';
import { useUserContext } from "@/user-client/Provider";
import withingsApi from '@/withings/api';
import userApi from '@/diet-server/user/user.api';
import { useEffect, useRef, useState } from 'react';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type * as t from '@/withings-client/types';

type RedirectProps = {
  onRedirectBack?: () => void;
}

function Redirect({
  onRedirectBack
}: RedirectProps) {
  const queryClient = useQueryClient()
  const hasBeenSet = useRef(false);

  const { user } = useUserContext()
  const { code } = useQueryParams()

  const [accessResponse, setAccessResponse] = useState<t.AccessResponse>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const addAccessTokenMutation = useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUser'] })
    },
  })

  useEffect(() => {
    if (!code || !user || !user.id || hasBeenSet.current) return;
    setIsLoading(true);

    hasBeenSet.current = true;
    console.log('fetching access token', code);

    const fetchAccessToken = async () => {
      try {
        const accessResponse = await withingsApi.getAccessToken({ code });
        console.log('accessResponse', accessResponse);

        if (accessResponse.error || !accessResponse?.access_token) {
          setError(accessResponse.error);
          setIsLoading(false);
          return
        }

        setAccessResponse(accessResponse);

        const updatedUser = {
          ...user,
          withings: accessResponse
        };
        console.log('updating_user', updatedUser);
        addAccessTokenMutation.mutate({ uid: user.id, user: updatedUser });
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message || 'Error occured');
        setIsLoading(false);
      }
    };

    fetchAccessToken();
  }, [code, user]);

  if (error) return <div>{error}</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <Page className="flex justify-center items-center">

      <p>
        You now have access to to whitings
      </p>
      <p>
        Here is your access token: {accessResponse?.access_token}
      </p>
      <button
        onClick={onRedirectBack}
      >
        Go back to application
      </button>
    </Page>
  )

}

export default Redirect;


