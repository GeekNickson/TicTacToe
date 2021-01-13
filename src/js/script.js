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

  return {
    getBoard,
    init,
    setMark,
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
  }

  const gameloop = () => {
    Renderer.getSquares().forEach((square) => {
      square.addEventListener('click', (event) => {
        const index = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget);
        if (playerOne.getTurn()) {
          event.currentTarget.textContent = playerOne.getMarker();
          Gameboard.setMark(playerOne.getMarker(), index);
          changeTurns();
        } else if (playerTwo.getTurn()) {
          event.currentTarget.textContent = playerTwo.getMarker();
          Gameboard.setMark(playerTwo.getMarker(), index);
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
