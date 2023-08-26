import React from "react";
import * as t from "@/diet-server/diet.types"
import itemApi from '@/diet-server/item/item.api'
import { useUserContext } from "@/user-client/Provider";

type DailySummaryProps = {
  daily: t.DailyDiet
}

function DailySummary({
  daily
}: DailySummaryProps) {
  const { user } = useUserContext()

  const dailyMacros = daily ? itemApi.calculateMacros(daily.dailyItems) : { calories: 0, protein: 0, grams: 0 }

  return (
    <>
      <p>Target Calories: {user.targetCalories}</p>
      <p>Target Proteins: {user.targetProteins}</p>
      <p>Remaining Calories: {user.targetCalories - dailyMacros.calories}</p>
      <p>Remaining Proteins: {user.targetProteins - dailyMacros.protein}</p>
      <p className="text-red-500">Yesterdays diff Calories: {daily?.yesterdaysCaloryDiff}</p>
      <p className="text-red-500">Yersterdays diff Proteins: {daily?.yesterdaysProteinDiff}</p>
    </>
  )
}

export default DailySummary;

