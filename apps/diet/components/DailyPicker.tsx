import React from "react";

type DailyPickerProps = {
  dailyKey: string
  onPrev: () => void
  onNext: () => void
}

function DailyPicker (props: DailyPickerProps) {
  const { dailyKey, onNext, onPrev} = props

  const readableData = dailyKey

  return (
    <div>
      <button onClick={onPrev}>prev</button>
      {readableData}
      <button onClick={onNext}>next</button>
    </div >
  )
}

export default DailyPicker;
