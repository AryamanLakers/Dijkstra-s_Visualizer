import { getneighbours, getShortestPath } from "./Dijkstra";
import { animations } from "../Animations/animations.js";
export const bfs = (grid, start, target) => {
  const queue = [];
  let visited = [];
  const node = grid[start.row][start.col];
  const target_node = grid[target.row][target.col];
  queue.push(node);
  node.distance = 0;
  //actually we there is not cost nodes explicitly defined by the user
  //then bfs works similiar to djikstra

  while (queue.length > 0) {
    const curr = queue.shift();
    if (curr === target_node) break;
    if (curr.isVisited) continue;
    if (curr.isWall) continue;
    if (curr.distance === Infinity) break;
    curr.isVisited = true;
    visited.push(curr);

    const unvisited_nodes = getneighbours(curr, grid);
    unvisited_nodes.forEach((item) => {
      item.distance = Math.min(curr.distance + 1, item.distance);
      item.parent = curr;
      queue.push(item);
    });
  }
  visited = visited.filter((nodes, index) => {
    return visited.indexOf(nodes) === index;
  });
  const shortestPath = getShortestPath(grid, target);
  animations(visited, shortestPath);
};
