import { GAME_LEVELS } from "../helpers/constants.js";

export class Model {
  constructor(view) {
    this._view = view;

    this._board = [];
    this._minesScore = 0;
    this._sizeX = 0;
    this._sizey = 0;

    this._isGameNotStarted = true;
    this._isGameOver = false;
    this._currentLevel = 0;
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

  get isGameNotStarted() {
    return this._isGameNotStarted;
  }

  set isGameNotStarted(gameStatus) {
    this._isGameNotStarted = gameStatus;
  }

  get isGameOver() {
    return this._isGameOver;
  }

  gameOver(status) {
    this._isGameOver = true;
    this._view.gameOver(status, this._board);
  }

  gameStart(status) {
    this._isGameOver = false;
    this._view.gameStart(status);
  }
}
