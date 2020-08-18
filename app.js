document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.grid-user');
  const computerGrid = document.querySelector('.grid-computer');
  const displayGrid = document.querySelector('.grid-display');
  const ships = document.querySelectorAll('.ship');
  const destroyer = document.querySelector('.destroyer-container');
  const submarine = document.querySelector('.submarine-container');
  const cruiser = document.querySelector('.cruiser-container');
  const battleship = document.querySelector('.battleship-container');
  const carrier = document.querySelector('.carrier-container');

  const startButton = document.querySelector('#start');
  const rotateButton = document.querySelector('#rotate');
  const turnDisplay = document.querySelector('#whose-go');
  const infoDisplay = document.querySelector('#info');
  let isHorizontal = true;

  const userSquares = [];
  const computerSquares = [];

  const width = 10;

  // Create boards

  function createBoards(grid, squares) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.dataset.id = i;
      grid.appendChild(square);
      squares.push(square);
    }
  }

  createBoards(userGrid, userSquares);
  createBoards(computerGrid, computerSquares);

  // Ships

  const shipArray = [
    {
      name: 'destroyer',
      directions: [
        [0, 1],
        [0, width],
      ],
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3],
      ],
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width * 2, width * 3, width * 4],
      ],
    },
  ];

  // Draw the computers ships in random positions

  function generateShips(ship) {
    let randomDirections = Math.floor(
      Math.random() * ship.directions.length,
    );
    let current = ship.directions[randomDirections];

    if (randomDirections === 0) {
      direction = 1;
    }

    if (randomDirections === 1) {
      direction = 10;
    }

    let randomStart = Math.floor(
      Math.abs(
        Math.random() * computerSquares.length -
          ship.directions[0].length * direction,
      ),
    );

    const isTaken = current.some((index) =>
      computerSquares[randomStart + index].classList.contains(
        'taken',
      ),
    );
    const isAtRightEdge = current.some(
      (index) => (randomStart + index) % width === width - 1,
    );
    const isAtLeftEdge = current.some(
      (index) => (randomStart + index) % width === 0,
    );

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
      current.forEach((index) =>
        computerSquares[randomStart + index].classList.add(
          'taken',
          ship.name,
        ),
      );
    } else {
      generateShips(ship);
    }
  }

  shipArray.forEach((ship) => generateShips(ship));

  // Rotate the ships

  function rotate() {
    if (isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = false;
      console.log(isHorizontal);
      return;
    }
    if (!isHorizontal) {
      destroyer.classList.toggle('destroyer-container');
      submarine.classList.toggle('submarine-container');
      cruiser.classList.toggle('cruiser-container');
      battleship.classList.toggle('battleship-container');
      carrier.classList.toggle('carrier-container');
      isHorizontal = true;
      console.log(isHorizontal);
      return;
    }
  }

  rotateButton.addEventListener('click', rotate);

  // Move the ships

  ships.forEach((ship) =>
    ship.addEventListener('dragstart', dragStart),
  );
  userSquares.forEach((ship) =>
    ship.addEventListener('dragstart', dragStart),
  );
  userSquares.forEach((ship) =>
    ship.addEventListener('dragover', dragOver),
  );
  userSquares.forEach((ship) =>
    ship.addEventListener('dragenter', dragEnter),
  );
  userSquares.forEach((ship) =>
    ship.addEventListener('drop', dragDrop),
  );
  userSquares.forEach((ship) =>
    ship.addEventListener('dragend', dragEnd),
  );

  let selectedShipNameWithIndex;
  let draggedShip;
  let draggedShipLength;

  ships.forEach((ship) =>
    ship.addEventListener('mousedown', (e) => {
      selectedShipNameWithIndex = e.target.id;
    }),
  );

  function dragStart() {
    draggedShip = this;
    draggedShipLength = this.children.length;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragDrop() {
    let shipNameWithLastId = draggedShip.lastElementChild.id;
    let shipClass = shipNameWithLastId.slice(0, -2);
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    let shipLastId = lastShipIndex + parseInt(this.dataset.id);

    selectedShipIndex = parseInt(
      selectedShipNameWithIndex.substr(-1),
    );

    shipLastId = shipLastId - selectedShipIndex;

    if (isHorizontal) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(this.dataset.id) - selectedShipIndex + i
        ].classList.add('taken', shipClass);
      }
    } else if (!isHorizontal) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(this.dataset.id) - (selectedShipIndex + width * i)
        ].classList.add('taken', shipClass);
      }
    }

    displayGrid.removeChild(draggedShip);
  }

  function dragEnd() {}
});
