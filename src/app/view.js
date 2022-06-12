import { SKILL_NAMES } from "../helpers/constants.js";

export class View {
  constructor() {
    this.boardElement = document.querySelector(".board");
    this.minesScoreElement = document.querySelector(".mines-score");
    this.controlsElement = document.querySelector(".controls");

    this.gameInfoElement = document.querySelector(".game-info");
    this.gameStatusElement = document.querySelector(".game-status");
    this.newGameButtonElement = document.querySelector(".new-game");

    this.modalElement = document.querySelector(".modal");
    this.openModalButtonElement = document.getElementById("open-button");
    this.closeModalButtonElement = document.getElementById("close-button");

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
      });
    });
    this.boardElement.style.setProperty("--sizeX", boardSizeX);
    this.boardElement.style.setProperty("--sizeY", boardSizeY);
  }

  gameOver(status, board) {
    this.controlsElement.classList.remove("game-start");
    this.controlsElement.classList.add("game-end");
    this.gameStatusElement.textContent = status;

    if (status === "lose") {
      this.newGameButtonElement.textContent = "New Game";
      this.gameStatusElement.textContent = "Lose";
    } else {
      this.newGameButtonElement.textContent = "Next Level";
      this.gameStatusElement.textContent = "Win";
    }

    if (status === "ended") {
      this.newGameButtonElement.textContent = "New Game";
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
    this.newGameButtonElement.textContent = "New Game";
  }

  highlightSkills(...skills) {
    for (const skill of skills) {
      let skillElement = document.getElementById(SKILL_NAMES[skill]);
      skillElement.classList.add("highlight");
    }
  }

  removeHighlight() {
    for (const skill of SKILL_NAMES) {
      let skillElement = document.getElementById(skill);
      skillElement.classList.remove("highlight");
    }
  }

  setSkillAmount(skill, amount) {
    let skillElement = document.querySelector(`.${skill}`);
    let amountNumberElement = skillElement.querySelector(".amount-number");
    amountNumberElement.textContent = amount;
  }

  selectSkill(skill) {
    let skillElement = document.getElementById(skill);
    skillElement.classList.add("selected");
    // console.info(skill);
  }

  unselectSkill(skill) {
    let skillElement = document.getElementById(skill);
    skillElement.classList.remove("selected");
  }

  resetSkills(skillsData) {
    for (const skill of SKILL_NAMES) {
      let skillElement = document.querySelector(`.${skill}`);
      let amountNumberElement = skillElement.querySelector(".amount-number");
      amountNumberElement.textContent = skillsData.get(skill);
    }
  }
}
