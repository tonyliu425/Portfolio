function initMinesweeper() {
    const grid = document.getElementById('game-container');
    const size = 10;
    const mineCount = 15;
    let mines = [];
    let revealed = [];
    let flagged = [];
    let gameOver = false;

    function createGrid() {
        grid.innerHTML = '';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${size}, 30px)`;
        grid.style.gap = '1px';

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', revealCell);
            cell.addEventListener('contextmenu', flagCell);
            grid.appendChild(cell);
        }
    }

    function placeMines() {
        mines = [];
        while (mines.length < mineCount) {
            const randomIndex = Math.floor(Math.random() * size * size);
            if (!mines.includes(randomIndex)) {
                mines.push(randomIndex);
            }
        }
    }

    function revealCell(event) {
        if (gameOver) return;
        const index = parseInt(event.target.dataset.index);
        if (flagged.includes(index)) return;

        if (mines.includes(index)) {
            event.target.classList.add('mine');
            gameOver = true;
            revealAllMines();
            alert('Game Over!');
            return;
        }

        const count = countAdjacentMines(index);
        event.target.textContent = count || '';
        event.target.classList.add('revealed');
        revealed.push(index);

        if (count === 0) {
            revealAdjacentCells(index);
        }

        checkWin();
    }

    function flagCell(event) {
        event.preventDefault();
        if (gameOver) return;
        const index = parseInt(event.target.dataset.index);
        if (revealed.includes(index)) return;

        if (flagged.includes(index)) {
            flagged = flagged.filter(i => i !== index);
            event.target.classList.remove('flagged');
        } else {
            flagged.push(index);
            event.target.classList.add('flagged');
        }
    }

    function countAdjacentMines(index) {
        let count = 0;
        const adjacentCells = getAdjacentCells(index);
        for (let cellIndex of adjacentCells) {
            if (mines.includes(cellIndex)) count++;
        }
        return count;
    }

    function getAdjacentCells(index) {
        const row = Math.floor(index / size);
        const col = index % size;
        const adjacentCells = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                    adjacentCells.push(newRow * size + newCol);
                }
            }
        }

        return adjacentCells;
    }

    function revealAdjacentCells(index) {
        const adjacentCells = getAdjacentCells(index);
        for (let cellIndex of adjacentCells) {
            if (!revealed.includes(cellIndex) && !flagged.includes(cellIndex)) {
                const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);
                cell.click();
            }
        }
    }

    function revealAllMines() {
        for (let mineIndex of mines) {
            const cell = document.querySelector(`.cell[data-index="${mineIndex}"]`);
            cell.classList.add('mine');
        }
    }

    function checkWin() {
        if (revealed.length + mines.length === size * size) {
            gameOver = true;
            alert('Congratulations! You won!');
        }
    }

    createGrid();
    placeMines();
}

// Snake
function initSnake() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementById('game-container').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let snake = [{x: 200, y: 200}];
    let direction = {x: 10, y: 0};
    let food = {x: 0, y: 0};

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Move snake
        const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
        snake.unshift(head);

        // Check collision with food
        if (head.x === food.x && head.y === food.y) {
            placeFood();
        } else {
            snake.pop();
        }

        // Draw snake
        ctx.fillStyle = 'green';
        snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 10, 10));

        // Draw food
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 10, 10);

        setTimeout(gameLoop, 100);
    }

    function placeFood() {
        food.x = Math.floor(Math.random() * 40) * 10;
        food.y = Math.floor(Math.random() * 40) * 10;
    }

    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'ArrowUp': direction = {x: 0, y: -10}; break;
            case 'ArrowDown': direction = {x: 0, y: 10}; break;
            case 'ArrowLeft': direction = {x: -10, y: 0}; break;
            case 'ArrowRight': direction = {x: 10, y: 0}; break;
        }
    });

    placeFood();
    gameLoop();
}

function init2048() {
    const grid = document.getElementById('game-container');
    let board = Array(4).fill().map(() => Array(4).fill(0));
    let score = 0;
    let gameActive = true;

    const tileColors = {
        2: "#eee4da",
        4: "#ede0c8",
        8: "#f2b179",
        16: "#f59563",
        32: "#f67c5f",
        64: "#f65e3b",
        128: "#edcf72",
        256: "#edcc61",
        512: "#edc850",
        1024: "#edc53f",
        2048: "#edc22e"
    };

    function createGrid() {
        grid.innerHTML = '';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        grid.style.gap = '10px';

        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell-2048');
            grid.appendChild(cell);
        }
    }

    function updateGrid() {
        const cells = document.querySelectorAll('.cell-2048');
        board.flat().forEach((value, index) => {
            cells[index].textContent = value || '';
            cells[index].style.backgroundColor = value ? (tileColors[value] || "#3c3a32") : "#ccc0b3";
            cells[index].style.color = value <= 4 ? "#776e65" : "#f9f6f2";
        });
        document.getElementById('score').textContent = `Score: ${score}`;
    }

    function addNewTile() {
        const emptyTiles = board.flat().reduce((acc, curr, index) =>
            curr === 0 ? [...acc, index] : acc, []);
        if (emptyTiles.length > 0) {
            const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[Math.floor(randomIndex / 4)][randomIndex % 4] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    function reverse(matrix) {
        return matrix.map(row => row.slice().reverse());
    }

    function moveLeft(board) {
        return board.map(row => {
            let newRow = row.filter(tile => tile !== 0);
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    score += newRow[i];
                    newRow.splice(i + 1, 1);
                }
            }
            while (newRow.length < 4) {
                newRow.push(0);
            }
            return newRow;
        });
    }

    function move(direction) {
        if (!gameActive) return;

        let newBoard = board;
        if (direction === 'up') {
            newBoard = transpose(board);
            newBoard = moveLeft(newBoard);
            newBoard = transpose(newBoard);
        } else if (direction === 'right') {
            newBoard = reverse(board);
            newBoard = moveLeft(newBoard);
            newBoard = reverse(newBoard);
        } else if (direction === 'down') {
            newBoard = transpose(board);
            newBoard = reverse(newBoard);
            newBoard = moveLeft(newBoard);
            newBoard = reverse(newBoard);
            newBoard = transpose(newBoard);
        } else if (direction === 'left') {
            newBoard = moveLeft(board);
        }

        if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
            board = newBoard;
            addNewTile();
            updateGrid();
            if (isGameOver()) {
                gameActive = false;
                alert('Game Over! Your score: ' + score);
            }
        }
    }

    function isGameOver() {
        if (board.flat().includes(0)) return false;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (
                    (j < 3 && board[i][j] === board[i][j + 1]) ||
                    (i < 3 && board[i][j] === board[i + 1][j])
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    function handleKeyPress(event) {
        if (!gameActive) return;

        switch(event.key) {
            case 'ArrowUp': move('up'); break;
            case 'ArrowDown': move('down'); break;
            case 'ArrowLeft': move('left'); break;
            case 'ArrowRight': move('right'); break;
        }
    }

    document.addEventListener('keydown', handleKeyPress);

    createGrid();
    addNewTile();
    addNewTile();
    updateGrid();
}


function initFlappyBird() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.getElementById('game-container').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let bird = {x: 50, y: 200, velocity: 0};
    let pipes = [];
    let gameStarted = false;
    let score = 0;

    function drawStartScreen() {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Click to Start', canvas.width / 2 - 50, canvas.height / 2);
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            drawStartScreen();
            return;
        }

        // Update bird position
        bird.velocity += 0.5;
        bird.y += bird.velocity;

        // Draw bird
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bird.x, bird.y, 30, 30);

        // Update and draw pipes
        pipes.forEach(pipe => {
            pipe.x -= 2;
            ctx.fillStyle = 'green';
            ctx.fillRect(pipe.x, 0, 50, pipe.top);
            ctx.fillRect(pipe.x, pipe.bottom, 50, canvas.height - pipe.bottom);
        });

        // Add new pipes
        if (pipes.length === 0 || pipes[pipes.length - 1].x < 250) {
            const gap = 150;
            const top = Math.random() * (canvas.height - gap - 100) + 50;
            pipes.push({x: canvas.width, top, bottom: top + gap});
        }

        // Remove off-screen pipes and update score
        pipes = pipes.filter(pipe => {
            if (pipe.x + 50 < 0) {
                score++;
                return false;
            }
            return true;
        });

        // Draw score
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);

        // Check collision
        if (bird.y > canvas.height || bird.y < 0 || pipes.some(pipe =>
            bird.x + 30 > pipe.x && bird.x < pipe.x + 50 &&
            (bird.y < pipe.top || bird.y + 30 > pipe.bottom))) {
            gameOver();
            return;
        }

        requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 40);
        ctx.fillText('Click to Restart', canvas.width / 2 - 60, canvas.height / 2 + 80);
        gameStarted = false;
    }

    function startGame() {
        bird = {x: 50, y: 200, velocity: 0};
        pipes = [];
        score = 0;
        gameStarted = true;
        gameLoop();
    }

    function flap() {
        if (gameStarted) {
            bird.velocity = -8;
        }
    }

    canvas.addEventListener('click', () => {
        if (!gameStarted) {
            startGame();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // Prevent scrolling
            flap();
        }
    });

    drawStartScreen();
}


