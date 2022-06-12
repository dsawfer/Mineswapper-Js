import { GAME_LEVELS, NUMBER_OF_SKILLS } from "../helpers/constants.js";

class User {
  constructor(view) {
    this._view = view;
    this.skills = new Map();

    this.skills.set("scan", 1);
    this.skills.set("probe", 0);
    this.skills.set("heal-points", 1);
    this.skills.set("explode", 0);
    this.skills.set("show-wrong", 0);

    this._selectedSkill = "none";

    this.skillsElement = document.querySelector(".skills");
    this.skillsElement.onclick = (event) => {
      if (event.target.classList.contains("highlight")) {
        this.addSkill(event.target.id);
        this._view.removeHighlight();
      } else {
        if (event.target.id === "heal-points") return;
        this._selectedSkill = event.target.id;
        this._view.selectSkill(event.target.id);
      }
    };
  }

  get selectedSkill() {
    return this._selectedSkill;
  }

  set selectedSkill(skill) {
    return (this._selectedSkill = skill);
  }

  addSkill(key) {
    this.skills.set(key, this.skills.get(key) + 1);
    let skillElement = document.querySelector(`.${key}`);
    let amountNumberElement = skillElement.querySelector(".amount-number");
    amountNumberElement.textContent = this.skills.get(key);
  }

  removeSkill(key) {
    this.skills.set(key, this.skills.get(key) - 1);
    let skillElement = document.querySelector(`.${key}`);
    let amountNumberElement = skillElement.querySelector(".amount-number");
    amountNumberElement.textContent = this.skills.get(key);
  }
}

export class Model {
  constructor(view) {
    this._view = view;
    this._user = new User(view);

    this._board = [];
    this._minesScore = 0;
    this._sizeX = 0;
    this._sizey = 0;

    this._currentLevel = 0;
    this._gameStatus = "not-started"; // not-started, started, win, lose, ended
  }

  getBoardConfig(selector) {
    switch (selector) {
      case "board-data":
        return this._board;
      case "board-sizes":
        return {
          x: this._sizeX,
          y: this._sizeY,
        };
    }
  }

  setBoardConfig(selector, value) {
    switch (selector) {
      case "board-data":
        this._board = value.board;
        this._view.drawBoard(value);
        break;
      case "board-sizes":
        const { x, y } = value;
        this._sizeX = x;
        this._sizeY = y;
        break;
    }
  }

  getGameConfig(selector) {
    switch (selector) {
      case "current-level-config":
        return GAME_LEVELS[this._currentLevel];
      case "game-status":
        return this._gameStatus;
    }
  }

  setGameConfig(selector, value) {
    switch (selector) {
      case "game-status":
        this._gameStatus = value;
        break;
    }
  }

  get minesScore() {
    return this._minesScore;
  }

  set minesScore(score) {
    this._minesScore = score;
    this._view.minesScoreView = score;
  }

  get currentLevel() {
    return this._currentLevel;
  }

  set currentLevel(currentLevel) {
    this._currentLevel = currentLevel;
  }

  get selectedSkill() {
    return this._user.selectedSkill;
  }

  resetSelectedSkill() {
    this._user.selectedSkill = "none";
  }

  gameOver(status) {
    if (this._currentLevel === GAME_LEVELS.length - 1) {
      this._gameStatus = "ended";
    } else this._gameStatus = status;

    this._view.gameOver(status, this._board);
  }

  gameStart() {
    this._gameStatus = "not-started";
    this._view.removeHighlight();
    this._view.gameStart();
  }

  chooseSkill() {
    let first = -1;
    let second = -1;
    let third = -1;

    while (first === second || first === third || second === third) {
      first = Math.round(Math.random() * NUMBER_OF_SKILLS);
      second = Math.round(Math.random() * NUMBER_OF_SKILLS);
      third = Math.round(Math.random() * NUMBER_OF_SKILLS);
    }

    this._view.highlightSkills(first, second, third);
  }
}
