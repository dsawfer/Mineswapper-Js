export class View {
  constructor() {
    this.boardElement = document.querySelector(".board");
    this.minesScoreElement = document.querySelector(".mines-score");
    this.controlsElement = document.querySelector(".controls");
    // this.minesInfoElement = document.querySelector(".mines-info");
    this.gameInfoElement = document.querySelector(".game-info");
    this.gameStatusElement = document.querySelector(".game-status");
    this.newGameButton = document.querySelector(".new-game");

    this.modalElement = document.querySelector(".modal");
    this.openModalButtonElement = document.getElementById("open-button");
    this.closeModalButtonElement = document.getElementById("close-button");

    // this.firstSkillElement = document.querySelector(".scan");
    // this.secondSkillElement = document.querySelector(".probe");
    // this.thirdSkillElement = document.querySelector(".heal-points");
    // this.fourthSkillElement = document.querySelector(".explode");
    // this.fifthSkillElement = document.querySelector(".show-wrong");

    // this.skillsElement = document.querySelector(".skills");

    this.openModalButtonElement.onclick = () => {
      this.modalElement.style.display = "block";
    };

    this.closeModalButtonElement.onclick = () => {
      this.modalElement.style.display = "none";
    };
  }

  set minesScoreView(bombsCount) {
    this.minesScoreElement.textContent = bombsCount;
  }

  drawBoard({ board, controller, boardSizeX, boardSizeY }) {
    this.boardElement.innerHTML = "";

    board.forEach((row) => {
      row.forEach((tile) => {
        this.boardElement.append(tile.element);

        let holder = false;

        tile.element.addEventListener(
          "click",
          (tile.clickCallback = () => {
            controller.revealTile(tile);
            controller.checkGameEnd();
          })
        );
        tile.element.addEventListener(
          "contextmenu",
          (tile.contextmenuCallback = (e) => {
            e.preventDefault();
            controller.markTile(tile);
            controller.checkGameEnd();
          })
        );

        // tile.element.addEventListener(
        //   "mousedown",
        //   (this.mousedownCallback = () => {
        //     holder = setTimeout(function () {
        //       controller.markTile(tile);
        //       controller.checkGameEnd();
        //       holder = true;
        //     }, 1000);
        //   })
        // );
        // tile.element.addEventListener(
        //   "mouseup",
        //   (this.mouseupCallback = () => {
        //     if (holder !== true) clearTimeout(holder);
        //   })
        // );
      });
    });
    this.boardElement.style.setProperty("--sizeX", boardSizeX);
    this.boardElement.style.setProperty("--sizeY", boardSizeY);
  }

  clearBoard(board) {
    board.forEach((row) => {
      row.forEach((tile) => {
        tile.element.removeEventListener("click", this.clickCallback);
        tile.element.removeEventListener(
          "contextmenu",
          this.contextmenuCallback
        );
      });
    });
  }

  gameOver(status, board) {
    this.controlsElement.classList.remove("game-start");
    this.controlsElement.classList.add("game-end");
    this.gameStatusElement.textContent = status;

    if (status === "lose") {
      this.newGameButton.textContent = "New Game";
      this.gameStatusElement.textContent = "Lose";
    } else {
      this.newGameButton.textContent = "Next Level";
      this.gameStatusElement.textContent = "Win";
    }

    if (status === "ended") {
      this.newGameButton.textContent = "New Game";
      this.gameStatusElement.textContent = "Game Over";
    }

    board.forEach((row) => {
      row.forEach((tile) => {
        tile.element.removeEventListener("click", tile.clickCallback);
        tile.element.removeEventListener(
          "contextmenu",
          tile.contextmenuCallback
        );
      });
    });
  }

  gameStart() {
    this.controlsElement.classList.add("game-start");
    this.controlsElement.classList.remove("game-end");
    this.newGameButton.textContent = "New Game";
  }

  addSkill(skill) {
  }

  removeSkill(skill) {
  }
}
