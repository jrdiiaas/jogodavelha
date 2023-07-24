document.addEventListener("DOMContentLoaded", () => {
    // Aguarda o carregamento completo do DOM antes de executar o código dentro da função.

    // Obtém referências para elementos do DOM para manipulação posterior.
    const board = document.getElementById("board");
    const cells = document.querySelectorAll("[data-cell]");
    const statusDisplay = document.getElementById("status");
    const restartBtn = document.getElementById("restartBtn");
    const startBtn = document.getElementById("startBtn");
    const resetScoreBtn = document.getElementById("resetScoreBtn");
    const playerXName = document.getElementById("playerXName");
    const playerOName = document.getElementById("playerOName");
    const playerXScore = document.getElementById("playerXScore");
    const playerOScore = document.getElementById("playerOScore");

    // Define variáveis para acompanhar o estado do jogo, como o jogador atual, o tabuleiro do jogo, a pontuação e se o jogo está ativo.
    let currentPlayer = "X";
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let gameActive = false;
    let score = {
        X: 0,
        O: 0,
    };

    // Função para verificar se há um vencedor no jogo ou se houve empate.
    const checkWin = () => {
        // Aqui definimos os padrões de vitória, representando as combinações de células que levariam à vitória.
        const winPatterns = [
            [0, 1, 2], // Linhas horizontais
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6], // Linhas verticais
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8], // Diagonais
            [2, 4, 6]
        ];

        // Percorre os padrões de vitória para verificar se algum jogador ganhou.
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                gameActive = false;
                highlightWinCells(pattern); // Destaca as células vencedoras no tabuleiro.
                return gameBoard[a]; // Retorna o símbolo do jogador que venceu.
            }
        }

        // Se não houver um vencedor, verifica se todas as células foram preenchidas, resultando em um empate.
        if (!gameBoard.includes("")) {
            gameActive = false;
            return "T"; // Retorna "T" para indicar empate.
        }

        return null; // Se não houver vencedor ou empate, retorna null.
    };

    // Atualiza a pontuação do placar de acordo com o vencedor.
    const updateScore = (winner) => {
        // Incrementa a pontuação do jogador X se ele vencer.
        if (winner === "X") {
            score.X++;
            // Incrementa a pontuação do jogador O se ele vencer.
        } else if (winner === "O") {
            score.O++;
        }
        // Atualiza a exibição da pontuação do jogador X no HTML.
        playerXScore.textContent = score.X;
        // Atualiza a exibição da pontuação do jogador O no HTML.
        playerOScore.textContent = score.O;
    };

    // Destaca as células vencedoras no tabuleiro.
    const highlightWinCells = (pattern) => {
        for (const cellIndex of pattern) {
            cells[cellIndex].classList.add("win");
        }
    };

    // Função para atualizar a mensagem de status no jogo.
    const updateStatusMessage = (message) => {
        statusDisplay.textContent = message;
    };

    // Função para lidar com o clique em uma célula do tabuleiro.
    const handleCellClick = (event) => {
        const cell = event.target;
        const cellIndex = Array.from(cells).indexOf(cell);

        if (!gameActive || gameBoard[cellIndex] !== "") {
            return;
        }

        gameBoard[cellIndex] = currentPlayer;
        cell.dataset.cell = currentPlayer;
        cell.textContent = currentPlayer;

        const winner = checkWin();
        if (winner) {
            gameActive = false;
            if (winner === "T") {
                updateStatusMessage("Ninguém venceu. Vamos para a próxima partida!");
            } else {
                updateStatusMessage(`${winner} Parabéns! Você venceu essa! Confira o placar.`);
            }
            updateScore(winner);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateStatusMessage(`${currentPlayer}, Agora é com você!`);
        }
    };

    // Função para reiniciar o jogo.
    const restartGame = () => {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        updateStatusMessage(`${currentPlayer}, é com você!`);
        cells.forEach((cell) => {
            cell.textContent = "";
            cell.dataset.cell = "";
            cell.classList.remove("win");
        });
    };

    // Função para zerar o placar.
    const resetScore = () => {
        score.X = 0;
        score.O = 0;
        playerXScore.textContent = score.X;
        playerOScore.textContent = score.O;
    };

    // Event listener para o botão "Zerar Placar".
    resetScoreBtn.addEventListener("click", resetScore);

    // Função para iniciar o jogo.
    const startGame = () => {
        const playerXInput = document.getElementById("playerX");
        const playerOInput = document.getElementById("playerO");
        const playerXNameInput = playerXInput.value.trim() || "Jogador X";
        const playerONameInput = playerOInput.value.trim() || "Jogador O";

        playerXName.textContent = playerXNameInput;
        playerOName.textContent = playerONameInput;

        playerXInput.disabled = true;
        playerOInput.disabled = true;
        startBtn.disabled = true;

        gameActive = true;
        statusDisplay.textContent = `${playerXNameInput}, você começa!`;
    };

    // Event listener para o botão "Iniciar Jogo".
    startBtn.addEventListener("click", startGame);

    // Event listener para o botão "Reiniciar Jogo".
    restartBtn.addEventListener("click", restartGame);

    // Event listener para todas as células do tabuleiro.
    cells.forEach((cell) => {
        cell.addEventListener("click", handleCellClick);
    });

});
