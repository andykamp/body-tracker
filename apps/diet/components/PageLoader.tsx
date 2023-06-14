import React from "react";
import Page from "@/ui/Page";

type PageLoaderProps = {
  children: React.ReactNode
}
function PageLoader({
  children = 'Loading page...'
}: PageLoaderProps) {

  return (
    <Page >
      <div className="w-full h-full flex justify-center item-center">
        {children}
      </div>
    </Page>
  )
}

export default PageLoader

