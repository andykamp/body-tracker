import React, { useCallback, useEffect, useState } from 'react';

// ---------------------------------------------
// Draggable label
// ---------------------------------------------

type WrapperProps = {
  children: React.ReactNode;
  onClick: () => void;
  onDrag: (value: number) => void;
  value: number;
  min?: number;
  max?: number;
  increment?: number;
};

 function DraggableLabel({
  children,
  value,
  // setValue,
  onDrag: setValue,
  min = 0,
  max = 1,
  increment = 0.1,
}: WrapperProps) {
  // We are creating a snapshot of the values when the drag starts
  // because the [value] will itself change & we need the original
  // [value] to calculate during a drag.
  const [snapshot, setSnapshot] = useState(value);

  // This captures the starting position of the drag and is used to
  // calculate the diff in positions of the cursor.
  const [startVal, setStartVal] = useState(0);

  // Start the drag to change operation when the mouse button is down.
  const onStart = useCallback(
    (event:any) => {
      setStartVal(event.clientX);
      setSnapshot(value);
    },
    [value]
  );

  // We use document events to update and end the drag operation
  // because the mouse may not be present over the label during
  // the operation..
  useEffect(() => {
    // Only change the value if the drag was actually started.
    const onUpdate = (event:any) => {
      if (startVal) {
        let deltaX = event.clientX - startVal;
        let newValue = snapshot + (deltaX * increment);
        newValue = Math.max(Math.min(newValue, max), min); // Clamp to min and max
        setValue(newValue);
      }
    };

    // Stop the drag operation now.
    const onEnd = () => {
      setStartVal(0);
    };

    document.addEventListener('mousemove', onUpdate);
    document.addEventListener('mouseup', onEnd);
    return () => {
      document.removeEventListener('mousemove', onUpdate);
      document.removeEventListener('mouseup', onEnd);
    };
  }, [startVal, setValue, snapshot]);

  return (
    <div
      className="flex flex-row justify-center items-center px-2 h-full text-gray-500 cursor-ew-resize select-none"
      onMouseDown={onStart}
    >
      {children}
    </div>
  );
}

export default DraggableLabel;
