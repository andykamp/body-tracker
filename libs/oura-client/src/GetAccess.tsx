import { useUserContext } from "@/user-client/Provider";
import userApi from '@/diet-server/user/user.api';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Button, Input, useInput } from "@geist-ui/core";

function GetAccess() {
  const { user } = useUserContext()

  const { state, setState, reset, bindings } = useInput(user.oura?.access_token)

  const queryClient = useQueryClient()
  console.log('queryClient', queryClient);

  const addAccessTokenMutation = useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUser'] })
      console.log('onsuccess',);
      queryClient.setQueryData(['getUser'], { hei: 'ho' })

    },
  })

  const onSubmit = () => {
    const updatedUser = {
      ...user,
      oura: {
        access_token: state
      }
    };
    addAccessTokenMutation.mutate({ uid: user.id, user: updatedUser });
  }

  return (
    <div>
      <Input
        width="100px"
        {...bindings} />

      <Button onClick={onSubmit}>submit</Button>
    </div >
  )
}

export default GetAccess;
