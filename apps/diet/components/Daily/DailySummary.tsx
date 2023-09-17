import React from "react";
import * as t from "@/diet-server/diet.types"
import { useUserContext } from "@/user-client/Provider";

type DailySummaryProps = {
  daily: t.DailyDiet
}

function DailySummary({
  daily
}: DailySummaryProps) {
  const { user } = useUserContext()

  return (
    <>
      <p>Target Calories: {user.targetCalories}</p>
      <p>Target Proteins: {user.targetProteins}</p>
      <p>Remaining Calories: {user.targetCalories - (daily.calories || 0)}</p>
      <p>Remaining Proteins: {user.targetProteins - (daily.protein || 0)}</p>
      {}<p className="text-red-500">{daily?.yesterdaysCaloryDiff ? `Yesterdays diff Calories: ${daily?.yesterdaysCaloryDiff}` : '-'}</p>
      <p className="text-red-500">{daily.yesterdaysProteinDiff ? `Yersterdays diff Proteins: ${daily?.yesterdaysProteinDiff}` : '_'}</p>
    </>
  )
}

export default DailySummary;

