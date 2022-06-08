export class View {
  constructor() {
    this.boardElement = document.querySelector(".board");
    this.minesScoreElement = document.querySelector(".mines-score");

    this.clickCallback;
    this.contextmenuCallback;
    this.mousedownCallback;
    this.mouseupCallback;
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
}
