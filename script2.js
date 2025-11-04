const playerStatusEl = document.getElementById("player-status")
const playerCardsEl = document.getElementById("player-cards")
const dealerCardsEl = document.getElementById("dealer-cards")
const totalEl = document.getElementById("total-el")
const dealerTotalEl = document.getElementById("dealer-total")
const gameControlEl = document.getElementById("game-control")
const standEl = document.getElementById("stand-el")

let gameInfo = {
 playerCards: [],
 dealerCards: [],
 sum: 0,
 dealerSum: 0,
}

// Game

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
            gameControlEl.textContent = "Hit"

            gameInfo.playerCards = [randomCard(), randomCard()]
            gameInfo.sum = gameInfo.playerCards[0] + gameInfo.playerCards[1]
            totalEl.textContent = "Total: " + gameInfo.sum
            playerCardsEl.textContent = gameInfo.playerCards.join(", ")

            gameInfo.dealerCards = [randomCard()]
            dealerCardsEl.textContent = gameInfo.dealerCards.join(", ")
            gameInfo.dealerSum = gameInfo.dealerCards[0]
            dealerTotalEl.textContent = "Total: " + gameInfo.dealerSum + "+"

            if (gameInfo.sum > 21 || gameInfo.sum === 21) {
                setState(dealerTurnState())
            } else {
                setState(playerTurnState())
            }
        },
        hit(setState) {},
        stand(setState) {},
    }
}

function playerTurnState() {
    return {
        gameStart() {},
        hit(setState) {
            playerStatusEl.textContent = "Player hits"
            const newCard = randomCard()
            gameInfo.playerCards.push(newCard)
            gameInfo.sum += newCard
            totalEl.textContent = "Total: " + gameInfo.sum
            playerCardsEl.textContent = gameInfo.playerCards.join(", ")
            
            if (gameInfo.sum > 21 || gameInfo.sum === 21) {
                setState(dealerTurnState())
            }
        },
        stand(setState) {
            setState(dealerTurnState())
        }
    }
}

function dealerTurnState() {
    playerStatusEl.textContent = "Player stands"
    return {
        gameStart() {},
        hit(setState) {},
        stand(setState) {
            playerStatusEl.textContent = "dealer's turn"
            const newCard = randomCard()
            gameInfo.dealerCards.push(newCard)
            gameInfo.dealerSum += newCard
            dealerCardsEl.textContent = gameInfo.dealerCards.join(", ")
            dealerTotalEl.textContent = "Total: " + gameInfo.dealerSum

            while (gameInfo.dealerSum < 17) {
                const newCard = randomCard()
                gameInfo.dealerCards.push(newCard)
                gameInfo.dealerSum += newCard
                dealerCardsEl.textContent = gameInfo.dealerCards.join(", ")
                dealerTotalEl.textContent = "Total: " + gameInfo.dealerSum
            }

            setState(gameOverState())
        }
    }
}

function gameOverState() {
    return {
        gameOver(setState) {},
        hit(setState) {},
        stand(setState) {
            playerStatusEl.textContent = "Game over"
            gameControlEl.textContent = "Start Game"
            setState(waitingState())
        }
    }
}

// Game

function randomCard() {
    const randomNumber = Math.floor(Math.random() * 13) + 1
    if (randomNumber > 10) {
        return 10
    }
    return randomNumber
}

const game = createGame()

gameControlEl.addEventListener("click", function() {
    game.hit()
    game.startGame()
})

standEl.addEventListener("click", function() {
    game.stand()
})