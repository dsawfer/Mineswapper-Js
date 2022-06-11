import { GAME_LEVELS } from "../helpers/constants.js";

class User {
  constructor() {
    this.skills = new Map();
    this.skills.set('scan', 1);
    this.skills.set('probe', 0);
    this.skills.set('heal-points', 1);
    this.skills.set('explode', 0);
    this.skills.set('show-wrong', 0);
  }

  addSkill(key) {
    this.skills.set('key', this.skills.get(key) + 1);
  }

  deleteSkill(key) {
    this.skills.set('key', this.skills.get(key) - 1);
  }
}

export class Model {
  constructor(view) {
    this._view = view;

    this._board = [];
    this._minesScore = 0;
    this._sizeX = 0;
    this._sizey = 0;

    this._currentLevel = 0;

    this._gameStatus = "not-started"; // not-started, started, win, lose, ended
  }

  get boardData() {
    return this._board;
  }

  set boardData(config) {
    this._board = config.board;
    this._view.drawBoard(config);
  }

  get boardSizes() {
    return {
      x: this._sizeX,
      y: this._sizeY,
    };
  }

  set boardSizes({ x, y }) {
    this._sizeX = x;
    this._sizeY = y;
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

  get currentLevelConfig() {
    return GAME_LEVELS[this._currentLevel];
  }

  get gameStatus() {
    return this._gameStatus;
  }

  set gameStatus(status) {
    this._gameStatus = status;
  }

  gameOver(status) {
    if (this._currentLevel === this.GAME_LEVELS.length - 1) {
      this._gameStatus = "ended";
    } else this._gameStatus = status;

    this._view.gameOver(status, this._board);
  }

  gameStart() {
    this._gameStatus = "not-started";
    this._view.gameStart();
  }
}
