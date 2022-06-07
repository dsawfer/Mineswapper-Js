export class View {
  constructor() {
    this.boardElement = document.querySelector(".board");
    this.minesScoreElement = document.querySelector(".mines-score");

    this.clickCallback;
    this.contextmenuCallback;
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
          (this.clickCallback = () => {
            controller.revealTile(tile);
            controller.checkGameEnd();
          })
        );
        tile.element.addEventListener(
          "contextmenu",
          (this.contextmenuCallback = (e) => {
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
}
