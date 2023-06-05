'use client'
import { useRouter } from "next/navigation";
import { ROUTES_CONSOLE } from "@/diet/app/constants"
import Page from "@/ui/Page";
import useQueryParams from '@/diet/utils/queryParams';
import { useUserContext } from "@/diet/utils/UserProvider";
import withingsApi from '@/withings/withings.api';
import userApi from '@/diet-server/user/user.api';
import { useEffect, useRef, useState } from 'react';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

function Withings() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const hasBeenSet = useRef(false);

  const { user } = useUserContext()
  const { code } = useQueryParams()

  const [accessResponse, setAccessResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
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
        if (accessResponse.error || !accessResponse?.body?.access_token) {
          setError(accessResponse.error);
          setIsLoading(false);
        }
        setAccessResponse(accessResponse.body);

        const updatedUser = {
          ...user,
          withings: accessResponse.body
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
        onClick={() => router.push(ROUTES_CONSOLE.console)}
      >
        Go back to application
      </button>
    </Page>
  )

}

export default Withings;

