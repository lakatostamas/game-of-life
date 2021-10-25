import React, { useCallback, useRef, useState } from 'react';
import { generateLayout, generateNextState } from './utils';

interface IBoardProps {
  rowsCount: number;
  colsCount: number;
}

function Board(props: IBoardProps) {
  const { rowsCount = 0, colsCount = 0 } = props;
  const [grid, setGrid] = useState(generateLayout(Math.max(rowsCount, 1), Math.max(colsCount, 1)));

  const [isRunning, setIsRunning] = useState(false);

  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((grid) => generateNextState(grid));
    setTimeout(runSimulation, 1000);
  }, []);

  const onToggleCell = (point: [number, number]) => {
    const [x, y] = point;
    const value = grid[x][y];

    // there are other more performant ways to recreate this array
    // for example: immer.js, but I did not want to introduce any
    // extra dependency in this project
    const nextGrid = grid.map((row, rowIdx) =>
      row.map((field, colIdx) => {
        if (rowIdx === x && colIdx === y) {
          return value === 0 ? 1 : 0;
        }

        return field;
      }),
    );

    setGrid(nextGrid);
  };

  return (
    <>
      <button
        role="button"
        onClick={() => {
          setIsRunning(!isRunning);
          runningRef.current = !isRunning;

          if (!isRunning) {
            runSimulation();
          }
        }}
      >
        {isRunning ? 'stop' : 'start'}
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${colsCount}, 20px)`,
        }}
      >
        {grid.map((rows, rowIdx) =>
          rows.map((col, colIdx) => (
            <div
              role="button"
              key={`${rowIdx}-${colIdx}`}
              onClick={() => onToggleCell([rowIdx, colIdx])}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[rowIdx][colIdx] === 1 ? 'green' : 'transparent',
                border: '1px solid black',
              }}
            />
          )),
        )}
      </div>
    </>
  );
}

export default Board;
