import React, { useEffect, useRef, useState } from "react";
import {
  useQuery,
} from '@tanstack/react-query'
import dailyApi from "@/diet-server/daily/daily.api"
import { useAuthContext } from "@/auth-client/firebase/Provider";
import { dailyCacheKeys } from '@/diet-client/daily/daily.cache'
import DailySummary from "./DailySummary";
import DailyItemList from "./DailyItemList";
import DailyPicker from "./DailyPicker";
import { adjustDateByXDays } from "@/diet-server/daily/daily.utils";

function Daily() {
  const { user: authUser } = useAuthContext()
  const [dailyKey, setDailyKey] = useState(dailyApi.getTodaysDailyKey());
  const initialRender = useRef(true);

  const next = () => {
    const nextDay = adjustDateByXDays(dailyKey, 1)
    setDailyKey(nextDay)
  }

  const prev = () => {
    const prevDay = adjustDateByXDays(dailyKey, -1)
    setDailyKey(prevDay)
  }

  const { data, refetch } = useQuery({
    queryKey: dailyCacheKeys.getDaily,
    queryFn: () => dailyApi.getDaily({ userId: authUser.uid, dateKey: dailyKey })
  })

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!dailyKey || !refetch) return
    refetch()
  }, [dailyKey, refetch]);

  const daily = data
  console.log('dailyQuery', daily);
  if (!daily) return <div>loading daily</div>

  return (
    <div>
      <DailyPicker
        dailyKey={dailyKey}
        onPrev={prev}
        onNext={next}
      />
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
