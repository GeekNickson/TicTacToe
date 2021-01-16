const Renderer = (() => {
  const boardContainer = document.querySelector('.gameboard');
  const dropdown = document.querySelector('.dropdown');
  dropdown.firstChild.textContent = 'AI';

  dropdown.addEventListener('mouseover', () => {
    dropdown.querySelector('.dropdown-content').style.display = 'block';
  });

  dropdown.addEventListener('mouseout', () => {
    dropdown.querySelector('.dropdown-content').style.display = 'none';
  });

  const changePlayerType = () => {
    dropdown.querySelector('.dropdown-content').addEventListener('click', (event) => {
      dropdown.firstChild.textContent = '';
      dropdown.firstChild.textContent = event.target.textContent;
    });
  };

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

  const clearBoard = () => {
    getSquares().forEach(square => boardContainer.removeChild(square));
  }

  const displayControls = () => {
    document.querySelector('.controls').classList.add('controls-visible');
  };

  const hideControls = () => {
    document.querySelector('.controls').classList.remove('controls-visible');
  };

  const displayResult = (result) => {
    document.querySelector('.game-result').textContent = result;
  };

  const clearResult = () => {
    document.querySelector('.game-result').textContent = '';
  };

  return {
    renderBoard,
    getSquares,
    displayControls,
    hideControls,
    displayResult,
    clearResult,
    changePlayerType,
    clearBoard,
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

  const clear = () => {
    board.forEach((square) => (square.marker = ''));
  };

  const setMarker = (marker, index) => {
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

  const checkDraw = () => {
    return board.every((square) => square.marker !== '') ? true : false;
  };

  return {
    getBoard,
    init,
    setMarker,
    checkRows,
    checkColumns,
    checkDiagonals,
    checkDraw,
    clear,
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
  const restartButton = document.querySelector('.btn-restart');


  const changeTurns = () => {
    playerOne.toggleTurn();
    playerTwo.toggleTurn();
  };

  const checkWin = (marker) => {
    return Gameboard.checkColumns(marker) || Gameboard.checkRows(marker) || Gameboard.checkDiagonals(marker);
  };

  const checkDraw = () => {
    return Gameboard.checkDraw();
  };

  const restart = () => {
    Gameboard.clear();
    Renderer.clearBoard();
    Renderer.clearResult();
    Renderer.hideControls();
    Renderer.renderBoard(Gameboard.getBoard());
    gameloop();
  };

  restartButton.addEventListener('click', restart);

  const onGameFinished = (result) => {
    Renderer.displayResult(result);
    Renderer.displayControls();
    Renderer.getSquares().forEach((square) => square.removeEventListener('click', gameHandler));
  };

  const gameHandler = (event) => {
    const index = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget);

    if (playerOne.getTurn()) {
      event.currentTarget.textContent = playerOne.getMarker();
      Gameboard.setMarker(playerOne.getMarker(), index);
      console.warn(Gameboard.checkRows(playerOne.getMarker()));
      if (checkWin(playerOne.getMarker())) {
        onGameFinished('Player 1 Won!');
        return;
      } else if (checkDraw()) {
        onGameFinished("It's a Draw!");
        return;
      }
      changeTurns();
    } else if (playerTwo.getTurn()) {
      event.currentTarget.textContent = playerTwo.getMarker();
      Gameboard.setMarker(playerTwo.getMarker(), index);
      if (checkWin(playerTwo.getMarker())) {
        onGameFinished('Player 2 Won!');
        return;
      } else if (checkDraw()) {
        onGameFinished("It's a Draw!");
        return;
      }
      changeTurns();
    } else {
      return;
    }
  };
  const gameloop = () => {
    Renderer.getSquares().forEach((square) => {
      square.addEventListener('click', gameHandler);
    });
  };

  const init = () => {
    Renderer.changePlayerType();
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
