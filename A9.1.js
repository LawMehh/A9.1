document.addEventListener("DOMContentLoaded", function() {
    const chessboard = document.getElementById("chessboard");
    const startButton = document.getElementById("startButton");
    const clearButton = document.getElementById("clearButton");

    // Initial placement of pieces on the board for a checkers game
    const initialPieces = [
        '⚫', '', '⚫', '', '⚫', '', '⚫', '',
        '', '⚫', '', '⚫', '', '⚫', '', '⚫',
        '⚫', '', '⚫', '', '⚫', '', '⚫', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '⚪', '', '⚪', '', '⚪', '', '⚪',
        '⚪', '', '⚪', '', '⚪', '', '⚪', '',
        '', '⚪', '', '⚪', '', '⚪', '', '⚪',
    ];

    let board = [];
    let selectedPiece = null;
    let turn = '⚪'; // Start with white's turn

    // Function to initialize the board
    function startGame() {
        chessboard.innerHTML = ''; // Clear the board
        board = [...initialPieces]; // Initialize the board array with initial pieces

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement("div");
                square.className = "square";
                square.dataset.index = row * 8 + col; // Store the index of the square
                square.innerHTML = board[row * 8 + col]; // Place the piece (if any) on the square
                
                // Apply correct color
                if ((row + col) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }
                
                chessboard.appendChild(square);
            }
        }
    }

    // Function to clear the board
    function clearBoard() {
        chessboard.innerHTML = ''; // Clear the board
        board = Array(64).fill(''); // Reset the board array
    }

    // Function to check if a move is valid
    function isValidMove(fromIndex, toIndex) {
        const fromRow = Math.floor(fromIndex / 8);
        const fromCol = fromIndex % 8;
        const toRow = Math.floor(toIndex / 8);
        const toCol = toIndex % 8;

        const piece = board[fromIndex];
        const targetPiece = board[toIndex];

        // Ensure the target square is empty
        if (targetPiece !== '') return false;

        // Calculate row and column differences
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;

        // Simple move
        if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
            if ((piece === '⚪' && rowDiff === -1) || (piece === '⚫' && rowDiff === 1)) {
                return true;
            }
        }

        // Capture move
        if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
            const jumpedRow = (fromRow + toRow) / 2;
            const jumpedCol = (fromCol + toCol) / 2;
            const jumpedIndex = jumpedRow * 8 + jumpedCol;
            const jumpedPiece = board[jumpedIndex];

            if ((piece === '⚪' && rowDiff === -2 && jumpedPiece === '⚫') || 
                (piece === '⚫' && rowDiff === 2 && jumpedPiece === '⚪')) {
                board[jumpedIndex] = ''; // Remove the captured piece
                return true;
            }
        }

        return false;
    }

    // Function to handle piece movement
    function movePiece(fromIndex, toIndex) {
        if (isValidMove(fromIndex, toIndex)) {
            board[toIndex] = board[fromIndex];
            board[fromIndex] = '';
            selectedPiece = null;

            // Switch turn
            turn = turn === '⚪' ? '⚫' : '⚪';

            renderBoard();
        }
    }

    // Function to render the board
    function renderBoard() {
        chessboard.innerHTML = ''; // Clear the board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement("div");
                square.className = "square";
                const index = row * 8 + col;
                square.dataset.index = index; // Store the index of the square
                square.innerHTML = board[index]; // Place the piece (if any) on the square
                
                // Apply correct color
                if ((row + col) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }

                // Highlight selected piece
                if (selectedPiece && selectedPiece.index === index) {
                    square.classList.add('selected');
                }
                
                chessboard.appendChild(square);
            }
        }
    }

    // Add event listener for the start button
    startButton.addEventListener("click", startGame);

    // Add event listener for the clear button
    clearButton.addEventListener("click", clearBoard);

    // Handle click events on the board
    chessboard.addEventListener("click", function(event) {
        const target = event.target;
        const index = parseInt(target.dataset.index);

        // Select a piece if one is not already selected
        if (!selectedPiece && board[index] && board[index] === turn) {
            selectedPiece = { piece: board[index], index };
            renderBoard();
        } 
        // Move the selected piece to the new square
        else if (selectedPiece && target !== selectedPiece) {
            movePiece(selectedPiece.index, index);
        }
    });
});
