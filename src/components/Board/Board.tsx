import React from 'react';
import { useBoard } from './hook';
import styles from './Board.module.css';

interface IBoardProps {
  rowsCount: number;
  colsCount: number;
}

function Board(props: IBoardProps) {
  const { rowsCount = 0, colsCount = 0 } = props;
  const {
    onStartStopClick,
    onClear,
    onReset,
    onStepForward,
    onToggleCell,
    grid,
    isRunning,
    populationSize,
    generation,
  } = useBoard(rowsCount, colsCount);

  return (
    <>
      <button role="button" onClick={onStartStopClick}>
        {isRunning ? 'stop' : 'start'}
      </button>
      <button role="button" onClick={onClear}>
        Clear
      </button>
      <button role="button" onClick={onReset}>
        Reset
      </button>
      <button role="button" onClick={onStepForward}>
        Step forward
      </button>
      <p>Population size: {populationSize}</p>
      <p>Generation: {generation}</p>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${colsCount}, 20px)`,
        }}
      >
        {grid.map((rows, rowIdx) =>
          rows.map((col, colIdx) => (
            <div
              role="button"
              key={`${rowIdx}-${colIdx}`}
              onClick={() => onToggleCell([rowIdx, colIdx])}
              className={styles.cell}
              style={{
                backgroundColor:
                  grid[rowIdx][colIdx] === 1 ? 'green' : 'transparent',
              }}
            />
          )),
        )}
      </div>
    </>
  );
}

export default Board;
