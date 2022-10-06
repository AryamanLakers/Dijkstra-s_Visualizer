import "./styles.css";
import Node from "./Node.js";
import React, { useState, useEffect } from "react";
import useGrid from "./hooks/useGrid";
import { makeGrid, cal } from "./hooks/gridWork";
import { dijkstra } from "./Algorithm/Dijkstra";
import { bfs } from "./Algorithm/bfs";
import { dfs } from "./Algorithm/dfs";
import { astar } from "./Algorithm/astar";
import { best_first_search } from "./Algorithm/best_first_search";
import AlgoCard from "./Components/AlgoCard";
export default function App() {
  let n = 20;
  let m = 70;

  const blockColor = "black";
  const gridColor = "#c1f4c5";
  const weightColor = "blue";
  const [option, setOption] = useState(false);
  const [startAlgo, setAlgo] = useState("Algorithm");
  const [start, setStart] = useState({ row: 0, col: 0 });
  const [target, setTarget] = useState({ row: n - 1, col: m - 1 });
  //const { grid, setGrid } = useGrid(n, m, start, target);
  const [grid, setGrid] = useState([[]]);
  const [checkstart, setstart] = useState(false);
  const [checkgoal, setgoal] = useState(false);
  
  //whenever the dom loads we call this function  to set grid
  useEffect(() => {
    const grid = makeGrid(n, m, start, target);
    setGrid(grid);
  }, []);
  //to create blockages

  const onclick = (e, row1, col1) => {
    e.preventDefault();
    if (e.buttons !== 1) return;
    const node = grid[row1][col1];
    if (node.isstartnode || node.isendnode) return;
    //this is to create hinderance which are penetrable but has a cost
    if (e.ctrlKey && (startAlgo === "Dijkstra" || startAlgo === "astar")) {
      const newnode = {
        ...node,
        distance: 15
      };
      grid[row1][col1] = newnode;
      const tag = document.querySelector(`.kk${row1}-${col1}`);
      tag.style.backgroundColor = weightColor;
    }
    //this is to change the starting state
    else if (checkstart) {
      const tag = document.querySelector(`.kk${start.row}-${start.col}`);
      tag.style.backgroundColor = gridColor;
      setStart({ row: row1, col: col1 });
      e.target.style.backgroundColor = "green";
      setstart(!checkstart);
    }
    //this is to change the goal state
    else if (checkgoal) {
      let tag;
      if (document.readyState !== "loading") {
        tag = document.querySelector(`.kk${target.row}-${target.col}`);
        tag.style.backgroundColor = gridColor;
        setTarget({ row: row1, col: col1 });
        e.target.style.backgroundColor = "red";
        setgoal(!checkgoal);
        //const newgrid = makeGrid(n, m, start, { row: row1, col: col1 });
        const newgrid = calculate(n, m, start, { row: row1, col: col1 });
        setGrid(newgrid);
      }
    } else {
      //if it is a wall we update the grid
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
  //when goal point changes, we also have to change previous heruisitc for each node
  const calculate = (n, m, start, target) => {
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < m; j++) {
        const node = grid[i][j];
        const newnode = { ...node, heuristic: cal(i, j, start, target) };
        grid[i][j] = newnode;
      }
    }
    return grid;
  };

  const Algorithms = ["A*", "Dijkstra", "Bfs", "Dfs", "Best_First"];
  return (
    <div className="grid">
      <div className="csswork">
        //this div is to show the options of our algos, when i click the option div, we get list of Algocard components whicch shows our current algos
        <div
          className="options"
          onClick={() => {
            setOption(!option);
          }}
        >
          {option ? (
            Algorithms.map((item) => {
              return (
                <AlgoCard
                  startAlgo={startAlgo}
                  setAlgo={setAlgo}
                  className={item}
                  algo={item}
                />
              );
            })
          ) : (
            <div className="algotag">{startAlgo}</div>
          )}
        </div>
        //end of options list
        
        //start button
        <button
          onClick={() => {
            setstart(!checkstart);
          }}
        >
          Start
        </button>

        //goal set button
        <button
          onClick={() => {
            setgoal(!checkgoal);
          }}
        >
          Goal
        </button>

        //button to run the algo of our choice
        <button
          onClick={() => {
            if (startAlgo === "Dijkstra") dijkstra(grid, start, target, startAlgo);
            else if (startAlgo === "Bfs") bfs(grid, start, target);
            else if (startAlgo === "Dfs") dfs(grid, start, target);
            else if (startAlgo === "A*") astar(grid, start, target);
            else if (startAlgo === "Best_First")
              best_first_search(grid, start, target, startAlgo);
          }}
        >
          Run
        </button>

      </div>
      <div className="innerGrid">
        {grid.map((row, rowid) => {
          return (
            //number of row is 20 so here we refering to that row
            <div key={rowid} className="eachrow">
              {row.map((node, nodeid) => {
                //here we are traversing to all 70 col 
                return (
                  //this represent each single Node
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
                    onKeyPress={(e) => {
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
    </div>
  );
}
