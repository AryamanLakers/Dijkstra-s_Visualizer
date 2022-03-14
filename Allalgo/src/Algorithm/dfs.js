import { getneighbours, getShortestPath } from "./Dijkstra";
import { animations } from "../Animations/animations.js";
const visited = [];
let flag = -1;
const recursive = (grid, start, target, i, j, parent) => {
  const row = grid.length;
  const col = grid[0].length;
  if (i < 0 || j < 0 || i >= row || j >= col || flag === 1) return;
  let current = grid[i][j];
  let target1 = grid[target.row][target.col];

  if (current.isVisited) return;
  if (current.isWall) return;
  current.isVisited = true;
  current.parent = parent;
  visited.push(current);
  if (current === target1) {
    flag = 1;
    return;
  }
  recursive(grid, start, target, i + 1, j, current);
  recursive(grid, start, target, i, j + 1, current);
  recursive(grid, start, target, i - 1, j, current);
  recursive(grid, start, target, i, j - 1, current);
  return;
};
export const dfs = (grid, start, target) => {
  recursive(grid, start, target, start.row, start.col, null);
  const shortest_path = getShortestPath(grid, target);
  animations(visited, shortest_path);
};
