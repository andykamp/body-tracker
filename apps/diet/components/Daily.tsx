import React from "react";
import {
  useQuery,
} from '@tanstack/react-query'
import dailyApi from "@/diet-server/daily/daily.api"
import { useAuthContext } from "@/auth-client/firebase/Provider";
import { dailyCacheKeys } from '@/diet-client/daily/daily.cache'
import DailySummary from "./DailySummary";
import DailyItemList from "./DailyItemList";

function Daily() {
  const { user: authUser } = useAuthContext()

  const todaysDailyKey = React.useMemo(() => dailyApi.getTodaysDailyKey(), [])

  const query = useQuery({
    queryKey: dailyCacheKeys.getDaily,
    queryFn: () => dailyApi.getDaily({ userId: authUser.uid, dateKey: todaysDailyKey })
  })

  const daily = query.data
  console.log('dailyQuery', daily);
  if (!daily) return 'loading daily'

  return (
    <div>
      <DailySummary
        daily={daily}
      />
      <DailyItemList
        daily={daily}
      />
    </div >
  )
}

export default Daily;
