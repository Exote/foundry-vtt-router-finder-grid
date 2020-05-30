function findPath() {}

function config() {
  game.settings.register("route-finder", "snapToGrid", {
    name: game.i18n.localize("route-finder.snapToGrid.name"),
    hint: game.i18n.localize("route-finder.snapToGrid.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register("route-finder", "reportMoveToChat", {
    name: game.i18n.localize("route-finder.reportMoveToChat.name"),
    hint: game.i18n.localize("route-finder.reportMoveToChat.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register("route-finder", "strokeWidth", {
    name: game.i18n.localize("route-finder.strokeWidth.name"),
    hint: game.i18n.localize("route-finder.strokeWidth.hint"),
    scope: "world",
    config: true,
    default: 12,
    type: Number,
  });

  game.settings.register("route-finder", "fontSize", {
    name: game.i18n.localize("route-finder.fontSize.name"),
    hint: game.i18n.localize("route-finder.fontSize.hint"),
    scope: "world",
    config: true,
    default: 32,
    type: Number,
  });

  game.settings.register("route-finder", "allowDiagonals", {
    name: game.i18n.localize("route-finder.allowDiagonals.name"),
    hint: game.i18n.localize("route-finder.allowDiagonals.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register("route-finder", "orthogonalWeight", {
    name: game.i18n.localize("route-finder.orthogonalWeight.name"),
    hint: game.i18n.localize("route-finder.orthogonalWeight.hint"),
    scope: "world",
    config: true,
    default: 5,
    type: Number,
  });

  game.settings.register("route-finder", "diagonalWeight", {
    name: game.i18n.localize("route-finder.diagonalWeight.name"),
    hint: game.i18n.localize("route-finder.diagonalWeight.hint"),
    scope: "world",
    config: true,
    default: 5,
    type: Number,
  });

  game.settings.register("route-finder", "friendlyBlocksFriendly", {
    name: game.i18n.localize("route-finder.friendlyBlocksFriendly.name"),
    hint: game.i18n.localize("route-finder.friendlyBlocksFriendly.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register("route-finder", "friendlyBlocksNeutral", {
    name: game.i18n.localize("route-finder.friendlyBlocksNeutral.name"),
    hint: game.i18n.localize("route-finder.friendlyBlocksNeutral.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register("route-finder", "friendlyBlocksHostile", {
    name: game.i18n.localize("route-finder.friendlyBlocksHostile.name"),
    hint: game.i18n.localize("route-finder.friendlyBlocksHostile.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register("route-finder", "neutralBlocksFriendly", {
    name: game.i18n.localize("route-finder.neutralBlocksFriendly.name"),
    hint: game.i18n.localize("route-finder.neutralBlocksFriendly.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register("route-finder", "neutralBlocksNeutral", {
    name: game.i18n.localize("route-finder.neutralBlocksNeutral.name"),
    hint: game.i18n.localize("route-finder.neutralBlocksNeutral.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register("route-finder", "neutralBlocksHostile", {
    name: game.i18n.localize("route-finder.neutralBlocksHostile.name"),
    hint: game.i18n.localize("route-finder.neutralBlocksHostile.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register("route-finder", "hostileBlocksFriendly", {
    name: game.i18n.localize("route-finder.hostileBlocksFriendly.name"),
    hint: game.i18n.localize("route-finder.hostileBlocksFriendly.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register("route-finder", "hostileBlocksNeutral", {
    name: game.i18n.localize("route-finder.hostileBlocksNeutral.name"),
    hint: game.i18n.localize("route-finder.hostileBlocksNeutral.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register("route-finder", "hostileBlocksHostile", {
    name: game.i18n.localize("route-finder.hostileBlocksHostile.name"),
    hint: game.i18n.localize("route-finder.hostileBlocksHostile.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });
}

function buildLinkedList() {
  for (let x = 0; x <= Math.round(canvas.grid.width / canvas.grid.w); x++) {
    canvas.grid.linkedList[x] = [];
    for (let y = 0; y <= Math.round(canvas.grid.height / canvas.grid.h); y++) {
      canvas.grid.linkedList[x][y] = [];
      const topLeftPixel = canvas.grid.grid.getPixelsFromGridPosition(x, y);
      const centerPixel = canvas.grid.grid.getCenter(
        topLeftPixel[0],
        topLeftPixel[1]
      );
      const neighbors = canvas.grid.grid.getNeighbors(x, y);
      const centerNeighbors = [];
      neighbors.forEach((neighbor) => {
        const topLeftPixelNeighbor = canvas.grid.grid.getPixelsFromGridPosition(
          neighbor[0],
          neighbor[1]
        );
        const centerNeighbor = canvas.grid.grid.getCenter(
          topLeftPixelNeighbor[0],
          topLeftPixelNeighbor[1]
        );
        centerNeighbors.push({ x: centerNeighbor[0], y: centerNeighbor[1] });
      });
      /*
        [0][1][2]
        [3] x [4]
        [5][6][7]
      */
      centerNeighbors.forEach((centerNeighbor, index) => {
        const neighborRay = new Ray(centerNeighbor, {
          x: centerPixel[0],
          y: centerPixel[1],
        });
        if (!canvas.walls.checkCollision(neighborRay)) {
          const diagonalIndexes = [0, 2, 5, 7];
          if (diagonalIndexes.includes(index)) {
            if (game.settings.get("route-finder", "allowDiagonals")) {
              canvas.grid.linkedList[x][y].push({
                x: neighbors[index][0],
                y: neighbors[index][1],
                weight: game.settings.get("route-finder", "diagonalWeight"),
              });
            }
          } else {
            canvas.grid.linkedList[x][y].push({
              x: neighbors[index][0],
              y: neighbors[index][1],
              weight: game.settings.get("route-finder", "orthogonalWeight"),
            });
          }
        }
      });
    }
  }
}

function heuristicDistance(startX, startY, endX, endY) {
  const orthogonalWeight = game.settings.get(
    "route-finder",
    "orthogonalWeight"
  );
  const diagonalWeight = game.settings.get("route-finder", "diagonalWeight");
  if (game.settings.get("route-finder", "allowDiagonals")) {
    const min = Math.min(Math.abs(startX - endX), Math.abs(startY - endY));
    const max = Math.max(Math.abs(startX - endX), Math.abs(startY - endY));
    return min * diagonalWeight + (max - min) * orthogonalWeight;
  } else {
    return (
      (Math.abs(startX - endX) + Math.abs(startY - endY)) * orthogonalWeight
    );
  }
}

function findCurrentCell(openList) {
  let minValue = Infinity;
  let minIndex = -1;
  openList.forEach((cell, index) => {
    if (cell.distanceFromStart + cell.distanceToEnd < minValue) {
      minValue = cell.distanceFromStart + cell.distanceToEnd;
      minIndex = index;
    }
  });
  return minIndex;
}

function buildPathOut(path, currentCell, closedList) {
  const currentPixels = canvas.grid.grid.getPixelsFromGridPosition(
    currentCell.x,
    currentCell.y
  );
  path.push(canvas.grid.grid.getCenter(currentPixels[0], currentPixels[1]));
  if (currentCell.parent) {
    const previousCell = closedList.filter(
      (cell) =>
        cell.x === currentCell.parent.x && cell.y === currentCell.parent.y
    )[0];
    const output = buildPathOut(path, previousCell, closedList);
    return output;
  } else {
    return path;
  }
}

function run(endX, endY, openList, closedList, path) {
  const currentCellIndex = findCurrentCell(openList);
  closedList.push(openList.splice(currentCellIndex, 1)[0]);
  const currentCell = closedList[closedList.length - 1];
  currentCell.ran = true;
  if (currentCell.x === endX && currentCell.y === endY) {
    path = buildPathOut(path, currentCell, closedList);
  } else {
    currentCell.linkedCells.forEach((linkedCell) => {
      moveToOpenList(linkedCell.x, linkedCell.y, openList, closedList);
    });
    if (openList.length > 0) {
      run(endX, endY, openList, closedList, path);
    }
  }
}

function moveToOpenList(x, y, openList, closedList) {
  const movingIndex = closedList.findIndex(
    (cell) => cell.x === x && cell.y === y && !cell.ran
  );
  if (movingIndex >= 0) {
    const movingCell = closedList.splice(movingIndex, 1)[0];
    if (!movingCell.distanceFromStart) {
      movingCell.distanceFromStart = 0;
      movingCell.ran = true;
    }
    movingCell.linkedCells.forEach((linkedCell) => {
      const linkedInClosedIndex = closedList.findIndex(
        (cell) => cell.x === linkedCell.x && cell.y === linkedCell.y
      );
      if (linkedInClosedIndex >= 0) {
        if (
          closedList[linkedInClosedIndex].distanceFromStart === undefined ||
          movingCell.distanceFromStart + linkedCell.weight <
            closedList[linkedInClosedIndex].distanceFromStart
        ) {
          closedList[linkedInClosedIndex].distanceFromStart =
            movingCell.distanceFromStart + linkedCell.weight; //g
          closedList[linkedInClosedIndex].parent = {
            x: movingCell.x,
            y: movingCell.y,
          };
        }
      }
    });
    openList.push(movingCell);
  }
}

function findPath(startX, startY, endX, endY) {
  const startCell = canvas.grid.grid.getGridPositionFromPixels(startX, startY);
  const endCell = canvas.grid.grid.getGridPositionFromPixels(endX, endY);
  console.log(
    `Pathfinding from (${startCell[0]},${startCell[1]}) to (${endCell[0]},${
      endCell[1]
    }) heuristicDistance: ${heuristicDistance(
      startCell[0],
      startCell[1],
      endCell[0],
      endCell[1]
    )}`
  );
  const openList = [];
  const closedList = [];
  canvas.grid.linkedList.forEach((linkedListRow, linkedListX) => {
    linkedListRow.forEach((linkedCells, linkedListY) => {
      closedList.push({
        x: linkedListX,
        y: linkedListY,
        distanceToEnd: heuristicDistance(
          linkedListX,
          linkedListY,
          endCell[0],
          endCell[1]
        ),
        linkedCells,
      });
    });
  });
  let path = [];
  moveToOpenList(startCell[0], startCell[1], openList, closedList);
  run(endCell[0], endCell[1], openList, closedList, path);
  console.log(path);
  return path.reverse();
}

Hooks.on("canvasReady", () => {
  canvas.grid.linkedList = [];
  const startTime = new Date().getTime();
  buildLinkedList();
  console.log(canvas.grid.linkedList);
  const endTime = new Date().getTime();
  console.log(`Built Canvas Linked List, took ${endTime - startTime}ms`);
  canvas.grid.findPath = findPath;
  canvas.grid.findPath(0, 0, 1000, 1050);
});

Hooks.on("init", () => {
  config();
});
