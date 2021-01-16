const Renderer = (() => {
  boardContainer = document.querySelector('.gameboard');
  dropdown = document.querySelector('.dropdown');
  dropdown.firstChild.textContent = 'AI';

  dropdown.addEventListener('mouseover', () => {
    dropdown.querySelector('.dropdown-content').style.display = 'block';
  });

  dropdown.addEventListener('mouseout', () => {
    dropdown.querySelector('.dropdown-content').style.display = 'none';
  });

  const changePlayerType = (dropdown) => {
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
    changePlayerType(dropdown);
    board.forEach((square) => {
      boardContainer.appendChild(createSquare(setSquareMark(square.marker)));
    });
  };

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

  const checkDraw = () => {
    return Gameboard.checkDraw();
  };

  const gameloop = () => {
    Renderer.getSquares().forEach((square) => {
      square.addEventListener('click', (event) => {
        const index = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget);

        if (playerOne.getTurn()) {
          event.currentTarget.textContent = playerOne.getMarker();
          Gameboard.setMarker(playerOne.getMarker(), index);
          console.warn(Gameboard.checkRows(playerOne.getMarker()));
          if (checkWin(playerOne.getMarker())) {
            Renderer.displayResult('Player 1 Won!');
            Renderer.displayControls();
          } else if (checkDraw()) {
            Renderer.displayResult('It\'s a Draw!');
            Renderer.displayControls();
          }
          changeTurns();
        } else if (playerTwo.getTurn()) {
          event.currentTarget.textContent = playerTwo.getMarker();
          Gameboard.setMarker(playerTwo.getMarker(), index);
          if (checkWin(playerTwo.getMarker())) {
            Renderer.displayResult('Player 2 Won!');
            Renderer.displayControls();
          } else if (checkDraw()) {
            Renderer.displayResult('It\'s a Draw!');
            Renderer.displayControls();
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
