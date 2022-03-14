import { useState, useEffect } from "react";
import { makeGrid } from "./gridWork";
const useGrid = (n, m, start, target) => {
  const [grid, setGrid] = useState([[]]);

  useEffect(() => {
    const grid = makeGrid(n, m, start, target);
    setGrid(grid);
  }, []);

  return { grid, setGrid };
};

export default useGrid;
