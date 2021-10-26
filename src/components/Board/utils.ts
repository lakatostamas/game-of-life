import { operations } from './consts';
import { Grid, Point } from './model';

export function generateLayout(rowsCount: number, colCount: number) {
  return Array.from(Array(rowsCount)).map(() => Array.from(Array(colCount), () => 0));
}

export function generateNextState(grid: Grid) {
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

export function getPopulationSize(grid: Grid) {
  return grid.reduce((sum, row) => {
    const rowSum = row.reduce((acc, curr) => acc + curr, 0);
    return sum + rowSum;
  }, 0);
}

// there are other more performant ways to recreate the grid
// for example: immer.js, but I did not want to introduce any
// extra dependency in this project
export function updateCell(grid: Grid, point: Point) {
  const [x, y] = point;
  const value = grid[x][y];

  return grid.map((row, rowIdx) =>
    row.map((field, colIdx) => {
      if (rowIdx === x && colIdx === y) {
        return value === 0 ? 1 : 0;
      }

      return field;
    }),
  );
}

function _countNeighbors(grid: Grid, point: Point) {
  const [x, y] = point;
  const gridSize = [grid.length, grid[0].length];
  return operations.reduce((neighborCounts, currentOperation) => {
    const [operationX, operationY] = currentOperation;

    const observedField: Point = [x + operationX, y + operationY];

    if (!_isWithinGrid(observedField, gridSize as [number, number])) {
      return neighborCounts;
    }

    const fieldValue = grid[observedField[0]][observedField[1]];

    return neighborCounts + fieldValue;
  }, 0);
}

function _isWithinGrid(point: Point, gridSize: [number, number]) {
  const [x, y] = point;
  const [xBoundary, yBoundary] = gridSize;

  return x >= 0 && x < xBoundary && y >= 0 && y < yBoundary;
}
