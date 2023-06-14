
import React from "react";
import Page from "@/ui/Page";

type PageNotFoundProps = {
  children: React.ReactNode
}
function PageNotFound({
  children = 'Page Not Found :/'
}: PageNotFoundProps) {

  return (
    <Page >
      <div className="w-full h-full flex justify-center item-center">
        {children}
      </div>
    </Page>
  )
}

export default PageNotFound

