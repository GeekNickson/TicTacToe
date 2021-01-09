const Renderer = (() => {
  boardContainer = document.querySelector('.gameboard');

  const createSquare = (innerContent) => {
    const square = document.createElement('div');
    square.className = 'square';
    square.innerHTML = innerContent;
    return square;
  }

  const setSquareMark = (mark) => {
    return `<span>${mark}</span>`
  }

  const renderBoard = (board) => {
    board.forEach(square => {
      boardContainer.appendChild(createSquare(setSquareMark(square.mark)));
    })
  }

  return {
    renderBoard
  }
})();

const Gameboard = (() => {
  const board = [];
  const square = {
    mark: 'X'
  }

  const getBoard = () => {
    return board;
  }

  const init = () => {
    for (let i = 0; i < 9; i++) {
      board.push(square);
    }
  }

  const setMark = (mark, index) => {
    board[index] = mark;
  }

  return {
    getBoard,
    init,
    setMark,
  }
})();

const Controller =(() => {
  const init = () => {
    Gameboard.init();
    Renderer.renderBoard(Gameboard.getBoard());
  }

  init();
})();