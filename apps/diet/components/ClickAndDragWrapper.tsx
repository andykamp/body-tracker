import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ClickAndDragWrapper.css'

type WrapperProps = {
  children: React.ReactNode;
  onClick: () => void;
  onDrag: (value: number) => void;
  value: number;
  min?: number;
  max?: number;
  increment?: number;
};

function ClickAndDragWrapper({
  children,
  onClick,
  onDrag,
  value: initialValue,
  min = 0,
  max = 1,
  increment = 0.1
}: WrapperProps) {
  const wrapperRef = React.useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [value, setValue] = useState(initialValue);
  const disableClick = useRef(false);

  useEffect(() => {
    setStartX((wrapperRef.current as any).getBoundingClientRect().x)
  }, []);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.classList.add('cursor-col-resize');
  }

  const handleMouseUp = () => {
    setIsDragging(false);
    console.log('onmouseup', value,);
    if (!disableClick.current) {
      onClick();
    }
    else {
      disableClick.current = false;
    }
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mousemove', handleMouseMove);
    document.body.classList.remove('cursor-col-resize');
  }

  const handleMouseMove = (e: MouseEvent) => {
    disableClick.current = true;

    let deltaX = e.clientX - startX;
    let newValue = value + (deltaX * increment);
    newValue = Math.max(Math.min(newValue, max), min); // Clamp to min and max
    onDrag(newValue);
    setStartX(e.clientX);  // Reset startX for the next movement
  }

  return (
    <div
      ref={wrapperRef}  // assign the ref to your wrapper element
      onMouseDown={handleMouseDown}
      className={isDragging ? 'cursor-col-resize select-none' : ''}
    >
      {children}
    </div>
  );
};

export default ClickAndDragWrapper;
