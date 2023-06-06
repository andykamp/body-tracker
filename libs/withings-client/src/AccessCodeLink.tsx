import React from 'react'
import { useWithingsContext } from '@/withings-client/Provider'

function AccessCodeLink() {
  const { accessCodeLinkState } = useWithingsContext()
  if (!accessCodeLinkState) return null;
  const { error, accessCodeLink, isLoading, isFetching } = accessCodeLinkState

  if (error) {
    return <div className="text-red-500">An error occurred</div>
  }

  const showAccessButton = accessCodeLink && !isLoading && !isFetching

  return (
    <div>
      {showAccessButton ?
        < a href={accessCodeLink}>Click here to get access</a>
        : <div>loading...</div>
      }
    </div >
  )
}

export default AccessCodeLink;
