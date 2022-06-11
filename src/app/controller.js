import {
  TILE_STATUSES,
  TILE_COLORS,
  BOMB_PERCENTAGE,
} from "../helpers/constants.js";

const SVG_PATH = "src/images/svg/";

let bombsCount = 0;

export class Controller {
  constructor(model) {
    this.model = model;

    this.newGameButton = document.querySelector(".new-game");
    this.newGameButton.addEventListener("click", () => {
      // this.model.isGameNotStarted = true;
      this.newGameButton.textContent = "New Game";

      if (this.model.gameStatus === "win") {
        this.model.currentLevel += 1;
      } else {
        this.model.currentLevel = 0;
      }

      // this.model.gameStatus = "not-started";
      this.model.gameStart();
      this.generateBoard(this.model.currentLevelConfig);
    });
  }

  generateBoard([x, y]) {
    const board = [];
    bombsCount = Math.trunc(((x * y) / 100) * BOMB_PERCENTAGE);

    for (let i = 0; i < x; i++) {
      const row = [];
      for (let j = 0; j < y; j++) {
        const element = document.createElement("div");
        element.dataset.status = TILE_STATUSES.HIDDEN;
        element.style.backgroundImage = `url(${SVG_PATH}${TILE_STATUSES.HIDDEN}.svg)`;
        row.push({
          element: element,
          x: i,
          y: j,
          mine: false,
          clickCallback: undefined,
          contextmenuCallback: undefined,
          get status() {
            return this.element.dataset.status;
          },
          set status(value) {
            this.element.dataset.status = value;
            if (value === "number") element.style.backgroundImage = "none";
            else element.style.backgroundImage = `url(${SVG_PATH}${value}.svg)`;
          },
        });
      }
      board.push(row);
    }

    this.model.boardData = {
      board: board,
      controller: this,
      boardSizeX: x,
      boardSizeY: y,
    };

    this.model.boardSizes = { x, y };
    this.model.minesScore = bombsCount;
  }

  fillBoard(positions) {
    for (let i = 0; i < this.model.boardSizes.x; i++) {
      for (let j = 0; j < this.model.boardSizes.y; j++) {
        this.model.boardData[i][j].mine = positions.some((p) =>
          positionMatch(p, { x: i, y: j })
        );
      }
    }
    console.info(this.model.boardData);
  }

  generateMines(startTile) {
    const positions = [];

    while (positions.length < bombsCount) {
      const position = {
        x: randomNumber(this.model.boardSizes.x),
        y: randomNumber(this.model.boardSizes.y),
      };

      if (
        !positions.some((p) => positionMatch(p, position)) &&
        !positionMatch(startTile, position)
      ) {
        positions.push(position);
      }
    }

    this.fillBoard(positions);
  }

  nearbyTiles({ x, y }) {
    const tiles = [];

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        const tile = this.model.boardData[x + xOffset]?.[y + yOffset];
        if (tile) tiles.push(tile);
      }
    }

    return tiles;
  }

  markTile(tile) {
    if (
      tile.status !== TILE_STATUSES.HIDDEN &&
      tile.status !== TILE_STATUSES.MARKED
    ) {
      return;
    }

    if (tile.status === TILE_STATUSES.MARKED) {
      tile.status = TILE_STATUSES.HIDDEN;
      this.model.minesScore += 1;
    } else {
      tile.status = TILE_STATUSES.MARKED;
      this.model.minesScore -= 1;
    }
  }

  revealTile(tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
      return;
    }

    if (tile.mine) {
      tile.status = TILE_STATUSES.MINE;
      return;
    }

    if (this.model.gameStatus === "not-started") {
      this.generateMines(tile);
      this.model.gameStatus = "started";
    }

    tile.status = TILE_STATUSES.NUMBER;
    const adjacentTiles = this.nearbyTiles(tile);
    const mines = adjacentTiles.filter((t) => t.mine);
    if (mines.length === 0) {
      adjacentTiles.forEach((tile) => this.revealTile(tile));
    } else {
      tile.element.textContent = mines.length;
      tile.element.style.color = TILE_COLORS[mines.length];
    }
  }

  checkWin() {
    return this.model.boardData.every((row) => {
      return row.every((tile) => {
        return (
          tile.status === TILE_STATUSES.NUMBER ||
          (tile.mine && tile.status === TILE_STATUSES.MARKED) ||
          (!tile.mine && tile.status === TILE_STATUSES.HIDDEN)
        );
      });
    });
  }

  checkLose() {
    return this.model.boardData.some((row) => {
      return row.some((tile) => {
        return tile.status === TILE_STATUSES.MINE;
      });
    });
  }

  checkGameEnd() {
    if (this.model.gameStatus === "not-started") return;
    const win = this.checkWin();
    const lose = this.checkLose();

    if (win) {
      // console.info("Win");;
      this.model.gameOver("win");
    }
    if (lose) {
      // console.info("lose");
      this.model.gameOver("lose");
      this.model.boardData.forEach((row) => {
        row.forEach((tile) => {
          if (tile.status === TILE_STATUSES.MARKED) this.markTile(tile);
          if (tile.mine) this.revealTile(tile);
        });
      });
    }
  }
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}
