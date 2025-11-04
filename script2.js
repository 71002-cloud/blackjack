const playerStatusEl = document.getElementById("player-status")
const gameControlEl = document.getElementById("game-control")
const standEl = document.getElementById("stand-el")

function createGame() {
    let state = waitingState()

    function setState(newState) {
        state = newState
    }

    return {
        startGame: () => state.startGame(setState),
        hit: () => state.hit(setState),
        stand: () => state.stand(setState),
        getState: () => state
    }
}

function waitingState() {
    return {
        startGame(setState) {
            playerStatusEl.textContent = "Game started"
            setState(playerTurnState())
        }
    }
}

function playerTurnState() {
    return {
        hit(setState) {
            playerStatusEl.textContent = "Player hits"
        },
        stand(setState) {
            playerStatusEl.textContent = "Player stands"
            setState(dealerTurnState())
        }
    }
}

//function dealerTurnState()

//function gameOverState()

const game = createGame()

gameControlEl.addEventListener("click", function() {
    game.startGame()
    game.hit()
})

standEl.addEventListener("click", function() {
    game.stand()
})