'use client'
import GoogleLoginButton from '@/ui/GoogleLoginButton'
import { useRouter } from "next/navigation";
import { ROUTES_CONSOLE } from "@/diet/app/constants"
import Page from "@/ui/Page";
import useQueryParams from '@/diet/utils/queryParams';
import { useUserContext } from "@/diet/utils/UserProvider";
import withingsApi from '@/withings/withings.api';
import userApi from '@/diet-server/user/user.api';
import { useEffect } from 'react';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

function Withings() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { user } = useUserContext()
  const { code } = useQueryParams()

  const addAccessTokenMutation = useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getUser'] })
    },
  })

  useEffect(() => {
    if (!code || !user || !user.id) return;

    console.log('fetching access token', code );
    const fetchAccessToken = async () => {
      const accessResponse = await withingsApi.getAccessToken({ code });
      console.log('accessResponse', accessResponse);

      const updatedUser = {
        ...user,
        withings: accessResponse
      };
      console.log('updatedUser', updatedUser);
      addAccessTokenMutation.mutate({ uid: user.id, user: updatedUser });
    };

    fetchAccessToken();
  }, [code, user]);


  return (
    <Page className="flex justify-center items-center">
      <p>
        You now have access to to whitings
      </p>
      <p>
        Here is your access token: {code}
      </p>
      <button
        onClick={() => router.push(ROUTES_CONSOLE.console)}
      >
        Go to console
      </button>
    </Page>
  )

}

export default Withings;

