import React, { useEffect, useState, useRef } from 'react';

const App = () => {
  const boxRef = useRef();
  const anchor = useRef({});

  useEffect(() => {
    const move = (e) => {
      const { pageX: cursorX, pageY: cursorY } = e;

      const width = cursorX - anchor.current.x;
      const height = cursorY - anchor.current.y;

      if (width <= 0) {
        boxRef.current.style.left = `${cursorX}px`;
      } else {
        // Fix anchor position in case previous x is smaller than anchor x
        boxRef.current.style.left = `${anchor.current.x}px`;
      }

      if (height <= 0) {
        boxRef.current.style.top = `${cursorY}px`;
      } else {
        // Fix anchor position in case previous x is smaller than anchor y
        boxRef.current.style.top = `${anchor.current.y}px`;
      }

      boxRef.current.style.width = `${Math.abs(width)}px`;
      boxRef.current.style.height = `${Math.abs(height)}px`;
    };

    const down = (e) => {
      // Get click position
      const { pageX: x, pageY: y } = e;
      anchor.current = { x, y };

      boxRef.current.style.left = `${x}px`;
      boxRef.current.style.top = `${y}px`;
      boxRef.current.style.border = 'blue 2px dashed';

      window.addEventListener('mousemove', move);
    };

    const up = () => {
      window.removeEventListener('mousemove', move);
      boxRef.current.style.width = `${0}px`;
      boxRef.current.style.height = `${0}px`;
      boxRef.current.style.border = 'none';
    };

    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      window.removeEventListener('mousedown', down);
      window.addEventListener('mouseup', up);
      window.removeEventListener('mousemove', move);
    };
  }, []);

  return (
    <>
      <div
        ref={boxRef}
        style={{
          position: 'absolute',
        }}
      />
    </>
  );
};

export default App;
