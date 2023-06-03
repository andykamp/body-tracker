'use client'
import GoogleLoginButton from '@/ui/GoogleLoginButton'
import { useRouter } from "next/navigation";
import { ROUTES_CONSOLE } from "@/diet/app/constants"
import Page from "@/ui/Page";
import useQueryParams from '@/diet/utils/queryParams';

function Withings() {
  const router = useRouter()
  const { token } = useQueryParams()
  console.log('token', token);


  return (
    <Page className="flex justify-center items-center">
      <p>
        You now have access to to whitings
      </p>
      <p>
        Here is your access token: {token}
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

