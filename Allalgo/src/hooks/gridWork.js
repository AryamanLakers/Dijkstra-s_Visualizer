export const cal = (row, col, start, target) => {
  var a = target.col - col;
  var b = target.row - row;
  // var c = Math.sqrt(a * a + b * b);
  // return c;
  return Math.abs(a) + Math.abs(b);
};
const createNode = (row, col, start, target) => {
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
    distance: 1,
    isVisited: false,
    isWall: false,
    parent: null,
    isstartnode: false,
    isendnode: false,
    heuristic: cal(row, col, start, target)
  };
};

export function makeGrid(n, m, start, target) {
  let grid = [];
  console.log(target);
  for (var i = 0; i < n; i++) {
    let row = [];
    for (var j = 0; j < m; j++) {
      var node = createNode(i, j, start, target);
      row.push(node);
    }
    grid.push(row);
  }
  return grid;
}
