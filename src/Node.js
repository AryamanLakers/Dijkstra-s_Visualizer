import "./styles.css";
import React from "react";
export default function ({
  key,
  col,
  isFinish,
  row,
  grid,
  isStart,
  isWall,
  onMouseEnter,
  onMouseDown,
  className,
  isstartnode,
  isendnode
}) {
  //if it is starting node
  //note: is wall is still true for green and red, it may give problem in future
  if (isstartnode) {
    const class1 = `.kk${isStart.row}-${isStart.col}`;
    document.querySelector(class1).style.backgroundColor = "green";
  } else if (isendnode) {
    const class2 = `.kk${isFinish.row - 1}-${isFinish.col - 1}`;
    document.querySelector(class2).style.backgroundColor = "red";
  }
  return (
    <div
      id={`node-${row}-${col}`}
      className={`${className}`}
      onMouseDown={(e) => onMouseDown(e)}
      onMouseEnter={(e) => onMouseEnter(e)}
    ></div>
  );
}
