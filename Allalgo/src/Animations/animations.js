export const animations = (visited, shortestPath) => {
  //this is to paint the shortest distance from start to goal
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

  //this is to animate the nodes where the algorithm travels
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
  animateDjikstra(visited, shortestPath);
};
