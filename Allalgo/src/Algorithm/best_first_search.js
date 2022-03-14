import { getneighbours, getShortestPath } from "./Dijkstra";
import { animations } from "../Animations/animations.js";

function sortNodesByHeuristic(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.heuristic - nodeB.heuristic);
}
//it is similiar to djikstra as here also we greedly sort the queue by heuristic
//whereas in djikstra our sorting parameter was cost
export const best_first_search = (grid, start, target, algo) => {
  const queue = [];
  let visited = [];
  const node = grid[start.row][start.col];
  const target_node = grid[target.row][target.col];
  queue.push(node);
  node.distance = 0;
  while (!!queue.length) {
    sortNodesByHeuristic(queue);
    const curr = queue.shift();
    if (curr.isVisited) continue;
    if (curr.isWall) continue;
    if (curr.distance === Infinity) break;
    curr.isVisited = true;
    visited.push(curr);
    if (curr === target_node) break;
    const unvisited_nodes = getneighbours(curr, grid);

    unvisited_nodes.forEach((item) => {
      if (item.isVisited) return;
      item.distance = curr.distance + item.distance;
      item.parent = curr;
      queue.push(item);
    });
  }
  visited = visited.filter((nodes, index) => {
    return visited.indexOf(nodes) === index;
  });

  const shortestPath = getShortestPath(grid, target, algo);
  console.log(shortestPath);
  animations(visited, shortestPath);
};
