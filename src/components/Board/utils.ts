import { operations } from './consts';

export function generateLayout(rowsCount: number, colCount: number) {
  return Array.from(Array(rowsCount)).map(() => Array.from(Array(colCount), () => 0));
}

export function generateNextState(grid: Array<Array<number>>) {
  return grid.map((row, rowIdx) =>
    row.map((field, colIdx) => {
      const neighborCount = _countNeighbors(grid, [rowIdx, colIdx]);

      // underpopulation or overpopulation
      if (neighborCount < 2 || neighborCount > 3) {
        return 0;
      }

      if (neighborCount === 3 && field === 0) {
        return 1;
      }

      return field;
    }),
  );
}

function _countNeighbors(grid: Array<Array<number>>, point: [number, number]) {
  const [x, y] = point;
  const gridSize = [grid.length, grid[0].length];
  return operations.reduce((neighborCounts, currentOperation) => {
    const [operationX, operationY] = currentOperation;

    const observedField = [x + operationX, y + operationY];

    if (!_isWithinGrid(observedField as [number, number], gridSize as [number, number])) {
      return neighborCounts;
    }

    const fieldValue = grid[observedField[0]][observedField[1]];

    return neighborCounts + fieldValue;
  }, 0);
}

function _isWithinGrid(point: [number, number], gridSize: [number, number]) {
  const [x, y] = point;
  const [xBoundary, yBoundary] = gridSize;

  return x >= 0 && x < xBoundary && y >= 0 && y < yBoundary;
}
