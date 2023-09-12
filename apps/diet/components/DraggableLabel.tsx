import React, { useCallback, useEffect, useState } from 'react';

type DraggableLabelProps = {
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
}: DraggableLabelProps) {
  // We are creating a snapshot of the values when the drag starts
  // because the [value] will itself change & we need the original
  // [value] to calculate during a drag.
  const [snapshot, setSnapshot] = useState(value);

  // This captures the starting position of the drag and is used to
  // calculate the diff in positions of the cursor.
  const [startVal, setStartVal] = useState(0);

  // Start the drag to change operation when the mouse button is down.
  const onStart = useCallback(
    (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      let clientX: number;

      if ('clientX' in event) {
        clientX = event.clientX;
      } else if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
      } else {
        return; // Exit if no valid event type
      }
      setStartVal(clientX);
      setSnapshot(value);

    },
    [value]
  );

  // We use document events to update and end the drag operation
  // because the mouse may not be present over the label during
  // the operation..
  useEffect(() => {
    // Only change the value if the drag was actually started.
    const onUpdate = (event: MouseEvent | TouchEvent) => {
      if (startVal) {
        let clientX: number;

        if (event instanceof MouseEvent) {
          clientX = event.clientX;
        } else if (event instanceof TouchEvent && event.touches.length > 0) {
          clientX = event.touches[0].clientX;
        } else {
          return; // Exit if no valid event type
        }

        const deltaX = clientX - startVal;
        let newValue = snapshot + (deltaX * increment);
        newValue = Math.max(Math.min(newValue, max), min); // Clamp to min and max
        setValue(newValue);
      }
    };

    // Stop the drag operation now.
    const onEnd = () => {
      setStartVal(0);
    };

    // Add event listeners for mouse and touch events.
    document.addEventListener('mousemove', onUpdate);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onUpdate);
    document.addEventListener('touchend', onEnd);

    return () => {
      // Clean up event listeners for both mouse and touch events.
      document.removeEventListener('mousemove', onUpdate);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onUpdate);
      document.removeEventListener('touchend', onEnd);
    };
  }, [startVal, setValue, snapshot, increment, min, max]);

  return (
    <div
      className="flex flex-row justify-center items-center px-2 h-full text-gray-500 cursor-ew-resize select-none"
      onMouseDown={onStart}
      onTouchStart={onStart}
    >
      {children}
    </div>
  );
}

export default DraggableLabel;
