import React, { useEffect, useState, useRef } from 'react';

const removeUnit = (string) => parseInt(string.replace('px', ''), 10);

const Cell = ({ boundingRect }) => {
  return (
    <div
      style={{
        border: '1px solid black',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />

  );
};

const grids = Array.from(Array(100).keys());

const App = () => {
  const boxRef = useRef();
  const anchor = useRef({});
  // const [dimensions, setDimensions] = useState({});

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

      const {
        left, top,
      } = boxRef.current.style;

      const newWidth = Math.abs(width);
      const newHeight = Math.abs(height);
      const newLeft = removeUnit(left);
      const newTop = removeUnit(top);

      const grids = document.querySelector('.grids-wrapper').querySelectorAll('div');

      // Evaluate each grid
      for (let i = 0; i < grids.length; i += 1) {
        const {
          x: cellX, y: cellY, width: cellWidth, height: cellHeight,
        } = grids[i].getBoundingClientRect();

        if (cellX > newLeft
          && cellX + cellWidth < newLeft + newWidth
          && cellY > newTop
          && cellY + cellHeight < newTop + newHeight) {
          grids[i].style.background = 'red';
        } else {
          grids[i].style.background = 'transparent';
        }
      }
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
      <div
        style={{
          display: 'flex', width: '100%', justifyContent: 'center', marginTop: '200px',
        }}
      >
        <div
          className="grids-wrapper"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 20px)',
            gridTemplateRows: 'repeat(10, 20px)',
          }}
        >
          {
            grids.map((i) => {
              return (
                <Cell
                  key={i}
                />
              );
            })
          }
        </div>
      </div>
    </>
  );
};

export default App;
