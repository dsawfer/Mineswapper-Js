import { GAME_LEVELS } from "../helpers/constants.js";

export class Model {
  constructor(view) {
    this._view = view;

    this._board = [];
    this._minesScore = 0;
    this._x = 0;
    this._y = 0;

    this._isGameNotStarted = true;
    this._currentLevel = 1;
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
      x: this._x,
      y: this._y,
    };
  }

  set boardSizes({ x, y }) {
    this._x = x;
    this._y = y;
  }

  get minesScore() {
    return this._minesScore;
  }

  set minesScore(score) {
    this._minesScore = score;
    this._view.minesScoreView = score;
  }

  get currentLevel() {
    return GAME_LEVELS[this._currentLevel];
  }

  set currentLevel(currentLevel) {
    this._currentLevel = currentLevel;
  }

  get isGameNotStarted() {
    return this._isGameNotStarted;
  }

  set isGameNotStarted(gameStatus) {
    this._isGameNotStarted = gameStatus;
  }
}
