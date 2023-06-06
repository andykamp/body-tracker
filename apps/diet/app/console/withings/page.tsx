'use client'
import Page from "@/ui/Page";
import WithingsRedirect from '@/withings-client/Redirect';

function Withings() {

  return (
    <Page className="flex justify-center items-center">
      <WithingsRedirect/>
    </Page>
  )

}

export default Withings;

