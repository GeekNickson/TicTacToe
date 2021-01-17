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
  }

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
    reset,
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
  const playButton = document.querySelector('.btn-play');
  playButton.addEventListener('click', () => {
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
    Renderer.getSquares().forEach((square) => square.removeEventListener('click', gameHandler));
  };

  const gameHandler = (event) => {
    const index = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget);

    if (playerOne.getTurn()) {
      event.currentTarget.style.color = 'rgba(66, 102, 150, 0.8)';
      event.currentTarget.textContent = playerOne.getMarker();
      event.currentTarget.classList.remove('opaque');
      event.currentTarget.removeEventListener('click', gameHandler);

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
      event.currentTarget.style.color = 'rgba(248, 82, 82, 0.8)';
      event.currentTarget.textContent = playerTwo.getMarker();
      event.currentTarget.classList.remove('opaque');
      event.currentTarget.removeEventListener('click', gameHandler);

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
