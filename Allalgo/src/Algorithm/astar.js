import { getneighbours, getShortestPath } from "./Dijkstra";
import { animations } from "../Animations/animations.js";

//in a star we sort the open queue with total_cost as the parameter
//as we want to move the path whose g(n)+h(n) is minimum
const sortByHeuristic = (open) => {
  let currentClosest = open[0],
    index;
  for (let i = 1; i < open.length; i++) {
    if (!currentClosest || currentClosest.total_cost > open[i].total_cost) {
      currentClosest = open[i];
      index = i;
    } else if (currentClosest.total_cost === open[i].total_cost) {
      if (currentClosest.heuristic > open[i].heuristic) {
        currentClosest = open[i];
        index = i;
      }
    }
  }
  open.splice(index, 1);
  return currentClosest;
};
const check = (item, list) => {
  for (var i = 0; i < list.length; i++) {
    if (item === list[i]) return { present: true, index: i };
  }
  return { present: false, index: -1 };
};

export const astar = (grid, start, target) => {
  const open = [];
  let closed = [];
  const target_node = grid[target.row][target.col];
  const node = grid[start.row][start.col];
  node.total_cost = 0;
  node.distance = 0;
  open.push(node);

  while (open.length > 0) {
    const curr = sortByHeuristic(open);
    if (curr.isWall) continue;
    //we add the sorted node in the closed queue
    closed.push(curr);
    if (curr.row === target_node.row && curr.col === target_node.col) break;
    const unvisited_nodes = getneighbours(curr, grid);
    //for all unvisited_nodes/neighbouring nodes we have to check whether
    //they are visited or not
    //if visited, then we have to compare whether total_cost from current node
    //is smaller than the previous node or not
    //if not visited then simply we add that in open queue
    unvisited_nodes.forEach((item, index) => {
      if (item.isWall) return;
      let indexOpen = check(item, open);
      let indexClosed = check(item, closed);
      if (indexClosed.present || item.iswall) return;
      if (!item.visited) {
        if (!indexOpen.present) {
          item.visited = true;
          item.distance = curr.distance + item.distance;
          item = { ...item, total_cost: item.distance + item.heuristic };
          item.parent = curr;
          open.push(item);
        } else if (indexOpen.present) {
          let index = indexOpen.index;
          let temp = open[index];
          var distance = Math.min(item.distance, curr.distance + item.distance);
          var cost = distance + item.heuristic;
          if (cost < item.total_cost) {
            temp.parent = curr;
            temp.total_cost = cost;
            temp.distance = distance;
          }
        }
      }
    });
  }

  closed = closed.filter((nodes, index) => {
    return closed.indexOf(nodes) === index;
  });
  const shortestPath = getShortestPath1(grid, closed, target);
  animations(closed, shortestPath);
};

function getShortestPath1(grid, closed, target) {
  const nodesWithShortestPath = [];
  if (closed[closed.length - 1].row !== target.row) return [];
  let curr = closed[closed.length - 1];
  while (curr != null) {
    nodesWithShortestPath.push(curr);
    curr = curr.parent;
  }
  return nodesWithShortestPath;
}
