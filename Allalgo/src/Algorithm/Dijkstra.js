import { animations } from "../Animations/animations";
export const getneighbours = (node, grid, algo) => {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return algo === "astar"
    ? neighbors
    : neighbors.filter((neighbor) => !neighbor.isVisited);
};

export const dijkstra = (grid, start, target, algo) => {
  const queue = [];
  let visited = [];
  const node = grid[start.row][start.col];
  const target_node = grid[target.row][target.col];
  queue.push(node);
  node.distance = 0;
  while (!!queue.length) {
    //now we know Djikstra is a greedy algorithm, therefore we have to sort
    //according to the shortest distance from the current node
    //it relies on local maxima like the best first search
    sortNodesByDistance(queue);
    const curr = queue.shift();
    if (curr.isVisited) continue;
    if (curr.isWall) continue;
    if (curr.distance === Infinity) break;
    curr.isVisited = true;
    visited.push(curr);
    if (curr === target_node) break;
    const unvisited_nodes = getneighbours(curr, grid);
    //for each unvisited nodes, it updates it's distance
    unvisited_nodes.forEach((item) => {
      if (item.isVisited) return;
      item.distance = curr.distance + item.distance;
      item.parent = curr;
      queue.push(item);
    });
  }
  //we filter out repetition
  visited = visited.filter((nodes, index) => {
    return visited.indexOf(nodes) === index;
  });

  const shortestPath = getShortestPath(grid, target, algo);
  animations(visited, shortestPath);
};

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}
//return the shortest path from goal to start state
export function getShortestPath(grid, target) {
  const nodesWithShortestPath = [];
  let curr = grid[target.row][target.col];
  while (curr != null) {
    nodesWithShortestPath.push(curr);
    curr = curr.parent;
  }
  return nodesWithShortestPath;
}
