import { useState, useRef, useCallback } from 'react';
import { Grid, Point } from './model';
import {
  generateLayout,
  generateNextState,
  getPopulationSize,
  updateCell,
} from './utils';

export function useBoard(rowsCount: number, colsCount: number) {
  const [grid, setGrid] = useState(
    generateLayout(Math.max(rowsCount, 1), Math.max(colsCount, 1)),
  );
  const [originalGrid, setOriginalGrid] = useState<Grid | null>(null);
  const [generation, setGeneration] = useState(0);
  const [populationSize, setPopulationSize] = useState(0);

  const [isRunning, setIsRunning] = useState(false);

  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;

  const calculateGridNextState = () => {
    setGeneration((prevValue) => prevValue + 1);
    setGrid((grid) => {
      const nextGrid = generateNextState(grid);
      setPopulationSize(getPopulationSize(nextGrid));

      return nextGrid;
    });
  };

  const onStartStopClick = () => {
    setIsRunning(!isRunning);
    runningRef.current = !isRunning;

    if (!isRunning) {
      if (!originalGrid) {
        setOriginalGrid(grid);
      }
      runSimulation();
    }
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    calculateGridNextState();

    setTimeout(runSimulation, 1000);
  }, []);

  const onToggleCell = (point: Point) => {
    if (generation > 0) {
      return;
    }

    const nextGrid = updateCell(grid, point);
    setPopulationSize(getPopulationSize(nextGrid));
    setGrid(nextGrid);
  };

  const onClear = () => {
    setIsRunning(false);
    setGrid(generateLayout(Math.max(rowsCount, 1), Math.max(colsCount, 1)));
    setOriginalGrid(null);
    setGeneration(0);
    setPopulationSize(0);
  };

  const onReset = () => {
    if (!originalGrid) {
      return;
    }

    setIsRunning(false);
    setGrid(originalGrid);
    setGeneration(0);
    setPopulationSize(getPopulationSize(originalGrid));

    // not clear from spec, but I assume we should store the new state as originalState
    setOriginalGrid(null);
  };

  const onStepForward = () => {
    if (!originalGrid) {
      setOriginalGrid(grid);
    }

    calculateGridNextState();
  };

  return {
    calculateGridNextState,
    runSimulation,
    onToggleCell,
    onClear,
    onReset,
    onStartStopClick,
    onStepForward,
    isRunning,
    populationSize,
    generation,
    grid,
  };
}
