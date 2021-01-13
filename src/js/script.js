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

const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return {
    getName,
    getMarker,
  };
};

const Controller = (() => {
  const playerOne = Player('one', 'X');
  const playerTwo = Player('two', 'O');

  let evenTurn = true;

  const toggleTurn = () => {
    evenTurn = !evenTurn;
  };

  const turn = (evenTurn) => {
    let currentPlayer = evenTurn ? playerOne : playerTwo;
    placeMarker(currentPlayer.getMarker());
  };

  const placeMarker = (marker) => {
    Renderer.getSquares().forEach((square) => {
      square.addEventListener('click', (event) => {
        if (event.currentTarget.textContent === '') {
          event.currentTarget.textContent = marker;
          const index = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget);
          Gameboard.setMark(marker, index);
          toggleTurn();
          turn(evenTurn);
        }
      });
    });
  };

  const init = () => {
    Gameboard.init();
    Renderer.renderBoard(Gameboard.getBoard());
    turn(evenTurn);
  };

  init();

  return {
    playerOne,
    playerTwo,
  };
})();
