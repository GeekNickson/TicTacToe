const Renderer = (() => {
  const boardContainer = document.querySelector('.gameboard');

  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns[0].firstChild.textContent = 'Human';
  dropdowns[1].firstChild.textContent = 'Human';

  const playerOneImages = document.querySelectorAll('.player-one-image');
  const playerTwoImages = document.querySelectorAll('.player-two-image');
  playerOneImages.forEach((image) => (image.src = './img/human.svg'));
  playerTwoImages.forEach((image) => (image.src = './img/human-2.svg'));

  const showMainMenu = () => {
    document.querySelector('.main-menu').classList.add('menu-opened');
  };

  const hideMainMenu = () => {
    document.querySelector('.main-menu').classList.remove('menu-opened');
  };

  const showGame = () => {
    document.querySelector('.tictactoe').classList.add('game-gamed');
  };

  const hideGame = () => {
    document.querySelector('.tictactoe').classList.remove('game-gamed');
  };

  dropdowns.forEach((dropdown) =>
    dropdown.addEventListener('mouseover', () => {
      dropdown.querySelector('.dropdown-content').style.display = 'block';
    })
  );

  dropdowns.forEach((dropdown) =>
    dropdown.addEventListener('mouseout', () => {
      dropdown.querySelector('.dropdown-content').style.display = 'none';
    })
  );

  const changePlayerType = () => {
    dropdowns[0].querySelector('.dropdown-content').addEventListener('click', (event) => {
      dropdowns[0].firstChild.textContent = '';
      dropdowns[0].firstChild.textContent = event.target.textContent;
      if (event.target.textContent === 'AI') {
        playerOneImages.forEach((image) => (image.src = './img/robot.svg'));
      } else {
        playerOneImages.forEach((image) => (image.src = './img/human.svg'));
      }
    });

    dropdowns[1].querySelector('.dropdown-content').addEventListener('click', (event) => {
      dropdowns[1].firstChild.textContent = '';
      dropdowns[1].firstChild.textContent = event.target.textContent;
      if (event.target.textContent === 'AI') {
        playerTwoImages.forEach((image) => (image.src = './img/robot-2.svg'));
      } else {
        playerTwoImages.forEach((image) => (image.src = './img/human-2.svg'));
      }
    });
  };

  const createSquare = (innerContent) => {
    const square = document.createElement('div');
    square.className = 'square opaque';
    square.innerHTML = innerContent;
    return square;
  };

  const getSquares = () => {
    return document.querySelectorAll('.square');
  };

  const getSquare = (index) => {
    return document.querySelectorAll('.square')[index];
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
    getSquares().forEach((square) => boardContainer.removeChild(square));
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

  const getPlayerOneType = () => {
    return dropdowns[0].firstChild.textContent;
  };

  const getPlayerTwoType = () => {
    return dropdowns[1].firstChild.textContent;
  };

  const renderTurn = (index, marker, color) => {
    selectedSquare = getSquare(index);
    selectedSquare.textContent = marker;
    selectedSquare.style.color = color;
    selectedSquare.classList.remove('opaque');
    return selectedSquare;
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
    showMainMenu,
    hideMainMenu,
    showGame,
    hideGame,
    renderTurn,
    getPlayerOneType,
    getPlayerTwoType,
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

  const reset = () => {
    board.length = 0;
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

  const checkEmpty = (index) => {
    return board[index].marker === '' ? true : false;
  };

  const checkAiWin = () => {
    if (checkRows('O') || checkColumns('O') || checkDiagonals('O')) {
      return 10;
    } else {
      return -10;
    }
  };

  const minimax = (isMax) => {
    let score = checkAiWin();

    if (score === 10) {
      return 10;
    }

    if (score === -10) {
      return -10;
    }

    if (checkDraw()) {
      return 0;
    }

    if (isMax) {
      let best = -1000;
      for (let i = 0; i < board.length; i++) {
        if (checkEmpty(i)) {
          board[i].marker = 'O';
          best = Math.max(best, minimax(board, !isMax));
          board[i].marker = '';
        }
      }
      return best;
    } else {
      best = 1000;
      for (let i = 0; i < board.length; i++) {
        if (checkEmpty(i)) {
          board[i].marker = 'X';
          best = Math.min(best, minimax(board, !isMax));
          baoard[i].marker = '';
        }
      }
      return best;
    }
  };

  const bestMove = () => {
    let bestValue = -1000;
    let moveIndex = -1;

    for (let i = 0; i < board.length; i++) {
      if (checkEmpty(i)) {
        board[i].marker = 'O';
        let moveValue = minimax(board, false);
        console.warn(moveValue);
        board[i].marker = '';

        if (moveValue > bestValue) {
          moveIndex = i;
          bestValue = moveValue;
        }
      }
    }
    return moveIndex;
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
    reset,
    bestMove,
  };
})();

const Player = (name, marker, turn, type, color) => {
  const getName = () => name;
  const getMarker = () => marker;
  const getTurn = () => turn;
  const toggleTurn = () => (turn = !turn);
  const getType = () => type;
  const getColor = () => color;

  return {
    getName,
    getMarker,
    getTurn,
    toggleTurn,
    getType,
    getColor,
  };
};

const Controller = (() => {
  let playerOne;
  let playerTwo;
  const playButton = document.querySelector('.btn-play');
  playButton.addEventListener('click', () => {
    playerOne = Player('Player 1', 'X', true, Renderer.getPlayerOneType(), 'rgba(66, 102, 150, 0.8)');
    playerTwo = Player('Player 2', 'O', false, Renderer.getPlayerTwoType(), 'rgba(248, 82, 82, 0.8)');
    Renderer.hideMainMenu();
    Renderer.showGame();
    init();
  });

  const restartButton = document.querySelector('.btn-restart');
  const backButton = document.querySelector('.btn-main-menu');
  backButton.addEventListener('click', () => {
    Gameboard.clear();
    Gameboard.reset();
    Renderer.clearBoard();
    Renderer.clearResult();
    Renderer.hideControls();
    Renderer.hideGame();
    Renderer.showMainMenu();
  });

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
    Renderer.getSquares().forEach((square) => square.removeEventListener('click', gameHandlerTwoHumans));
  };

  const gameHandlerTwoHumans = (event) => {
    const index = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget);
    if (playerOne.getTurn()) {
      const selectedSquare = Renderer.renderTurn(index, playerOne.getMarker(), playerOne.getColor());
      selectedSquare.removeEventListener('click', gameHandlerTwoHumans);

      Gameboard.setMarker(playerOne.getMarker(), index);
      if (checkWin(playerOne.getMarker())) {
        onGameFinished('Player 1 Won!');
        return;
      } else if (checkDraw()) {
        onGameFinished("It's a Draw!");
        return;
      }

      changeTurns();
    } else if (playerTwo.getTurn()) {
      const selectedSquare = Renderer.renderTurn(index, playerTwo.getMarker(), playerTwo.getColor());
      selectedSquare.removeEventListener('click', gameHandlerTwoHumans);

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
    if (playerOne.getType() === 'Human' && playerTwo.getType() === 'Human') {
      Renderer.getSquares().forEach((square) => {
        square.addEventListener('click', gameHandlerTwoHumans);
      });
    } else if (
      (playerOne.getType() === 'AI' && playerTwo.getType() === 'Human') ||
      (playerOne.getType() === 'Human' && playerTwo.getType() === 'AI')
    ) {
      //to do
    }
  };

  const init = () => {
    Gameboard.init();
    Renderer.renderBoard(Gameboard.getBoard());
    gameloop();
  };

  Renderer.showMainMenu();
  Renderer.changePlayerType();

  return {
    playerOne,
    playerTwo,
  };
})();
