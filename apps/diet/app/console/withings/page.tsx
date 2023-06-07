'use client'
import { useRouter } from "next/navigation";
import { ROUTES_CONSOLE } from "@/diet/app/constants"
import Page from "@/ui/Page";
import WithingsRedirect from '@/withings-client/Redirect';

function Withings() {
  const router = useRouter()

  return (
    <Page className="flex justify-center items-center">
      <WithingsRedirect
        onRedirectBack={() => router.push(ROUTES_CONSOLE.console)}
      />
    </Page>
  )

}

export default Withings;

