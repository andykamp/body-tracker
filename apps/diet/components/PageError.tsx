import React from "react";
import Page from "@/ui/Page";

type PageErrorProps = {
  children: React.ReactNode
}
function PageError({
  children = 'Bug found'
}: PageErrorProps) {

  return (
    <Page >
      <div className="w-full h-full flex justify-center item-center">
        {children}
      </div>
    </Page>
  )

}

export default PageError

