import dailyApi from "@/diet-server/daily/daily.api";
import React from "react";

type DailyPickerProps = {
  dailyKey: string
  onPrev: () => void
  onNext: () => void
}
const todayKey = dailyApi.getTodaysDailyKey()
function DailyPicker (props: DailyPickerProps) {
  const { dailyKey, onNext, onPrev} = props

  const readableData = dailyKey

  const isNextDisabled = dailyKey === todayKey
  return (
    <div>
      <button onClick={onPrev}>prev</button>
      {readableData}
      <button className={isNextDisabled?'text-gray-400 cursor-not-allowed':''}disabled={isNextDisabled} onClick={onNext}>next</button>
    </div >
  )
}

export default DailyPicker;
