import {
  TILE_STATUSES,
  TILE_COLORS,
  BOMB_PERCENTAGE,
  NUMBER_OF_SKILLS,
  SKILL_NAMES,
} from "../helpers/constants.js";

const SVG_PATH = "src/images/svg/";

let bombsCount = 0;

export class Controller {
  constructor(model) {
    this.model = model;

    this.newGameButton = document.querySelector(".new-game");
    this.newGameButton.addEventListener("click", () => {
      this.newGameButton.textContent = "New Game";

      if (this.model.getGameConfig("game-status") === "win") {
        this.model.currentLevel += 1;
      } else {
        this.model.currentLevel = 0;
        this.model.resetSkills();
      }

      this.model.gameStart();
      this.generateBoard(this.model.getGameConfig("current-level-config"));
    });

    this.skillsElement = document.querySelector(".skills");
    this.skillsElement.onclick = (event) => {
      if (event.target.classList.contains("highlight")) {
        this.model.addSkill(event.target.id);
        // this._view.removeHighlight();
      } else {
        if (
          event.target.id === "heal-points" ||
          this.model.getSkill(event.target.id) < 1 ||
          this.model.getGameConfig("game-status") !== "started"
        )
          return;

        switch (event.target.id) {
          case "explode":
            this.useSkill(null, "explode");
            break;
          case "show-wrong":
            this.useSkill(null, "show-wrong");
            break;
          default:
            this.model.selectSkill(event.target.id);
            break;
        }
      }
    };
  }

  generateBoard([x, y]) {
    const board = [];
    bombsCount = Math.trunc(((x * y) / 100) * BOMB_PERCENTAGE);

    for (let i = 0; i < y; i++) {
      const row = [];
      for (let j = 0; j < x; j++) {
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

    this.model.setBoardConfig("board-data", {
      board: board,
      controller: this,
      boardSizeX: x,
      boardSizeY: y,
    });

    this.model.setBoardConfig("board-sizes", { x, y });
    this.model.minesScore = bombsCount;
  }

  fillBoard(positions) {
    const { x, y } = this.model.getBoardConfig("board-sizes");
    const boardData = this.model.getBoardConfig("board-data");
    for (let i = 0; i < y; i++) {
      for (let j = 0; j < x; j++) {
        boardData[i][j].mine = positions.some((p) =>
          positionMatch(p, { x: i, y: j })
        );
      }
    }
    console.info(boardData);
  }

  generateMines(startTile) {
    const positions = [];
    const { x, y } = this.model.getBoardConfig("board-sizes");

    while (positions.length < bombsCount) {
      const position = {
        x: randomNumber(x),
        y: randomNumber(y),
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
    const boardData = this.model.getBoardConfig("board-data");

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        const tile = boardData[x + xOffset]?.[y + yOffset];
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

  useSkill(tile, skill) {
    // if (this.model.getSkill(skill) < 1) return;
    const { x, y } = this.model.getBoardConfig("board-sizes");
    const boardData = this.model.getBoardConfig("board-data");
    switch (skill) {
      case "scan":
        if (tile.mine) tile.status = TILE_STATUSES.MINE;
        else {
          tile.status = TILE_STATUSES.NUMBER;
          const adjacentTiles = this.nearbyTiles(tile);
          const mines = adjacentTiles.filter((t) => t.mine);
          tile.element.textContent = mines.length ? mines.length : "";
          tile.element.style.color = TILE_COLORS[mines.length];
        }
        setTimeout(() => {
          tile.status = TILE_STATUSES.HIDDEN;
          tile.element.textContent = "";
        }, 1000);
        break;
      case "probe":
        if (tile.mine) {
          tile.status = TILE_STATUSES.MINE;
          this.model.minesScore -= 1;
        }
        break;
      case "explode":
        loop: for (let i = 0; i < y; i++) {
          for (let j = 0; j < x; j++) {
            if (boardData[i][j].mine) {
              boardData[i][j].status = TILE_STATUSES.MINE;
              this.model.minesScore -= 1;
              break loop;
            }
          }
        }
        break;
      case "show-wrong":
        loop: for (let i = 0; i < y; i++) {
          for (let j = 0; j < x; j++) {
            if (
              boardData[i][j].status === TILE_STATUSES.MARKED &&
              !boardData[i][j].mine
            ) {
              boardData[i][j].status = TILE_STATUSES.HIDDEN;
              this.model.minesScore += 1;
              break loop;
            }
          }
        }
        break;
    }
    this.model.removeSkill(skill);
  }

  revealTile(tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
      return;
    }

    if (this.model.selectedSkill !== "none") {
      this.useSkill(tile, this.model.selectedSkill);
      this.model.resetSelectedSkill();
      return;
    }

    if (tile.mine && tile.status !== TILE_STATUSES.MINE) {
      tile.status = TILE_STATUSES.MINE;
      if (this.model.getGameConfig("game-status") !== "lose")
        this.model.removeSkill("heal-points");
      return;
    }

    if (this.model.getGameConfig("game-status") === "not-started") {
      this.generateMines(tile);
      this.model.setGameConfig("game-status", "started");
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
    return this.model.getBoardConfig("board-data").every((row) => {
      return row.every((tile) => {
        return (
          tile.status === TILE_STATUSES.NUMBER ||
          (tile.mine && tile.status === TILE_STATUSES.MARKED) ||
          (tile.mine &&
            tile.status === TILE_STATUSES.MINE &&
            this.model.getSkill("heal-points") !== 0) ||
          (!tile.mine && tile.status === TILE_STATUSES.HIDDEN)
        );
      });
    });
  }

  checkLose() {
    return this.model.getBoardConfig("board-data").some((row) => {
      return row.some((tile) => {
        return (
          tile.status === TILE_STATUSES.MINE &&
          this.model.getSkill("heal-points") === 0
        );
      });
    });
  }

  checkGameEnd() {
    if (this.model.getGameConfig("game-status") === "not-started") return;
    const win = this.checkWin();
    const lose = this.checkLose();

    if (win) {
      this.model.gameOver("win");
      this.model.chooseSkill();
    }
    if (lose) {
      this.model.gameOver("lose");
      this.model.getBoardConfig("board-data").forEach((row) => {
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
