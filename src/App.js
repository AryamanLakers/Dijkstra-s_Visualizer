import "./styles.css";
import Node from "./Node.js";
import React, { useState, useEffect } from "react";
export default function App() {
  let n = 20;
  let m = 70;

  const blockColor = "black";
  const gridColor = "#c1f4c5";
  const [start, setStart] = useState({ row: 0, col: 0 });
  const [target, setTarget] = useState({ row: n - 1, col: m - 1 });
  const [grid, setGrid] = useState([[]]);
  const [checkstart, setstart] = useState(false);
  const [checkgoal, setgoal] = useState(false);

  useEffect(() => {
    const grid = makeGrid();
    setGrid(grid);
  }, []);

  const createNode = (row, col) => {
    return {
      col,
      row,
      isStart: {
        row: start.row,
        col: start.col
      },
      isFinish: {
        row: target.row,
        col: target.col
      },
      distance: Infinity,
      isVisited: false,
      isWall: false,
      parent: null,
      isstartnode: false,
      isendnode: false
    };
  };

  function makeGrid() {
    let grid = [];
    for (var i = 0; i < n; i++) {
      let row = [];
      for (var j = 0; j < m; j++) {
        row.push(createNode(i, j));
      }
      grid.push(row);
    }

    return grid;
  }

  //to create blockages
  const onclick = (e, row1, col1) => {
    e.preventDefault();
    if (e.buttons !== 1) return;
    const node = grid[row1][col1];
    if (node.isstartnode || node.isendnode) return;
    if (checkstart) {
      const tag = document.querySelector(`.kk${start.row}-${start.col}`);
      tag.style.backgroundColor = gridColor;
      setStart({ row: row1, col: col1 });
      e.target.style.backgroundColor = "green";
      setstart(!checkstart);
    } else if (checkgoal) {
      let tag;
      if (document.readyState !== "loading") {
        tag = document.querySelector(`.kk${target.row}-${target.col}`);
        console.log(tag);
        tag.style.backgroundColor = gridColor;
        setTarget({ row: row1, col: col1 });
        e.target.style.backgroundColor = "red";
        setgoal(!checkgoal);
      }
    } else {
      if (node.isWall) {
        e.target.style.backgroundColor = gridColor;
      } else {
        e.target.style.backgroundColor = blockColor;
      }
      const newNode = {
        ...node,
        isWall: !node.isWall
      };
      grid[row1][col1] = newNode;
      setGrid(grid);
    }
  };

  const getneighbours = (node) => {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
  };

  const djikstra = () => {
    const queue = [];
    let visited = [];
    const node = grid[start.row][start.col];
    const target_node = grid[target.row][target.col];
    queue.push(node);
    node.distance = 0;
    while (!!queue.length) {
      sortNodesByDistance(queue);
      const curr = queue.shift();
      if (curr.isVisited) continue;
      if (curr.isWall) continue;
      if (curr.distance === Infinity) break;
      curr.isVisited = true;
      visited.push(curr);
      if (curr === target_node) break;
      const unvisited_nodes = getneighbours(curr);

      unvisited_nodes.forEach((item) => {
        item.distance = Math.min(curr.distance + 1, item.distance);
        item.parent = curr;
        queue.push(item);
      });
    }
    visited = visited.filter((nodes, index) => {
      return visited.indexOf(nodes) === index;
    });
    const shortestPath = getShortestPath(visited);
    animateDjikstra(visited, shortestPath);
  };

  async function animateDistance(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          const current1 = shortestPath[i];
          let tag = document.querySelector(
            `.kk${current1.row}-${current1.col}`
          );

          tag.className += " node-shortest-path";

          resolve(1);
        }, 10);
      });
    }
  }

  async function animateDjikstra(visited, shortestPath) {
    for (let i = 1; i <= visited.length; i++) {
      let current;
      if (i < visited.length) current = visited[i];
      if (i === visited.length) {
        await animateDistance(shortestPath);
        return;
      } else {
        await new Promise((resolve) => {
          setTimeout(() => {
            let tag = document.querySelector(
              `.kk${current.row}-${current.col}`
            );
            tag.className += ` node-visited`;
            resolve(1);
          }, 10);
        });
      }
    }
  }

  function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }

  function getShortestPath(visited) {
    const nodesWithShortestPath = [];
    let curr = grid[target.row][target.col];
    while (curr != null) {
      nodesWithShortestPath.push(curr);
      curr = curr.parent;
    }
    return nodesWithShortestPath;
  }

  function onclickPointer(e, row, col) {}
  return (
    <div className="grid">
      <button
        onClick={() => {
          setstart(!checkstart);
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          setgoal(!checkgoal);
        }}
      >
        Goal
      </button>
      <button
        onClick={() => {
          djikstra();
        }}
      >
        Run
      </button>
      {grid.map((row, rowid) => {
        return (
          <div key={rowid}>
            {row.map((node, nodeid) => {
              return (
                <Node
                  key={nodeid}
                  col={node}
                  isFinish={node.isFinish}
                  row={row}
                  grid={grid.length > 0 ? grid : [[]]}
                  isStart={node.isStart}
                  isWall={node.isWall}
                  onMouseEnter={(e) => {
                    onclick(e, rowid, nodeid);
                  }}
                  onMouseDown={(e) => {
                    onclick(e, rowid, nodeid);
                  }}
                  className={`kk${rowid}-${nodeid} node`}
                  isstartnode={node.isstartnode}
                  isendnode={node.isendnode}
                ></Node>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
