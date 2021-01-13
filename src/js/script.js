const Renderer = (() => {
  boardContainer = document.querySelector('.gameboard');

  const createSquare = (innerContent) => {
    const square = document.createElement('div');
    square.className = 'square';
    square.innerHTML = innerContent;
    return square;
  };

  const getSquares = () => {
    return document.querySelectorAll('.square');
  };

  const setSquareMark = (mark) => {
    return `<span>${mark}</span>`;
  };

  const renderBoard = (board) => {
    board.forEach((square) => {
      boardContainer.appendChild(createSquare(setSquareMark(square.marker)));
    });
  };

  return {
    renderBoard,
    getSquares,
  };
})();

const Gameboard = (() => {
  const board = [];
  const square = {
    marker: '',
  };

  const getBoard = () => {
    return board;
  };

  const init = () => {
    for (let i = 0; i < 9; i++) {
      board.push(square);
    }
  };

  const setMark = (marker, index) => {
    board[index] = { marker };
  };

  const checkRows = (marker) => {
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = i * 3; j < i * 3 + 3; j++) {
        row.push(board[j]);
      }

      if (row.every((square) => square.marker === marker)) {
        return true;
      }
    }

    return false;
  };

  const checkColumns = (marker) => {
    for (let i = 0; i < 3; i++) {
      let column = [];
      for (let j = 0; j < 3; j++) {
        column.push(board[i + 3 * j]);
      }

      if (column.every((square) => square.marker === marker)) {
        return true;
      }
    }

    return false;
  };

  const checkDiagonals = (marker) => {
    const mainDiagonal = [board[0], board[4], board[8]];
    const secondaryDiagonal = [board[2], board[4], board[6]];

    if (
      mainDiagonal.every((square) => square.marker === marker) ||
      secondaryDiagonal.every((square) => square.marker === marker)
    ) {
      return true;
    } else {
      return false;
    }
  };
  return {
    getBoard,
    init,
    setMark,
    checkRows,
    checkColumns,
    checkDiagonals,
  };
})();

const Player = (name, marker, turn) => {
  const getName = () => name;
  const getMarker = () => marker;
  const getTurn = () => turn;
  const toggleTurn = () => (turn = !turn);

  return {
    getName,
    getMarker,
    getTurn,
    toggleTurn,
  };
};

const Controller = (() => {
  const playerOne = Player('one', 'X', true);
  const playerTwo = Player('two', 'O', false);

  const changeTurns = () => {
    playerOne.toggleTurn();
    playerTwo.toggleTurn();
  };

  const checkWin = (marker) => {
    return Gameboard.checkColumns(marker) || Gameboard.checkRows(marker) || Gameboard.checkDiagonals(marker);
  };

  const gameloop = () => {
    Renderer.getSquares().forEach((square) => {
      square.addEventListener('click', (event) => {
        const index = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget);

        if (playerOne.getTurn()) {
          event.currentTarget.textContent = playerOne.getMarker();
          Gameboard.setMark(playerOne.getMarker(), index);
          console.warn(Gameboard.checkRows(playerOne.getMarker()));
          if (checkWin(playerOne.getMarker())) {
            console.log('Player one won');
          }
          changeTurns();
        } else if (playerTwo.getTurn()) {
          event.currentTarget.textContent = playerTwo.getMarker();
          Gameboard.setMark(playerTwo.getMarker(), index);
          if (checkWin(playerTwo.getMarker())) {
            console.log('Player two won');
          }
          changeTurns();
        } else {
          return;
        }

      });
    });
  };

  const init = () => {
    Gameboard.init();
    Renderer.renderBoard(Gameboard.getBoard());
    gameloop();
  };

  init();

  return {
    playerOne,
    playerTwo,
  };
})();
