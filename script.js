// Game Elements 
const playerStatusEl = document.getElementById("player-status")
const playerCardsEl = document.getElementById("player-cards")
const dealerCardsEl = document.getElementById("dealer-cards")
const totalEl = document.getElementById("total-el")
const dealerTotalEl = document.getElementById("dealer-total")
const gameControlEl = document.getElementById("game-control")
const standEl = document.getElementById("stand-el")
// bet Elements
const betAmountEl = document.getElementById("bet-amount")
const balanceAmountEl = document.getElementById("balance-amount-el")
const betPlus10El = document.getElementById("bet-plus-10")
const betPlus25El = document.getElementById("bet-plus-25")
const betMinus10El = document.getElementById("bet-minus-10")
const betMinus25El = document.getElementById("bet-minus-25")
const betConfirmEl = document.getElementById("bet-confirm")

// Game Info
let gameInfo = {
 playerCards: [],
 dealerCards: [],
 sum: 0,
 dealerSum: 0,
 renderWinCondition: "",
 playerState: "",
 bettingAllowed: false,
}

// Game
function createGame() {
    let state = waitingState()

    function setState(newState) {
        state = newState
        if (state.enter) {
            state.enter(setState)
        }
    }

    return {
        startGame: () => state.startGame(setState),
        hit: () => state.hit(setState),
        stand: () => state.stand(setState),
        getState: () => state
    }
}

function waitingState() {
    gameInfo.bettingAllowed = true
    return {
        startGame(setState) {
            bettingConfirm()
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
        gameStart(setState) {},
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
    return {
        enter(setState) {
            playerStatusEl.textContent = "Player stands"
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
        },
        gameStart(setState) {},
        hit(setState) {},
        stand(setState) {}
    }
}

function gameOverState() {
    return {
        enter(setState) {
            playerStatusEl.textContent = "Game over"
            gameControlEl.textContent = "Start Game"
            gameInfo.renderWinCondition = renderGame()
            setState(waitingState())
        },
        gameStart(setState) {},
        hit(setState) {},
        stand(setState) {}
    }
}

// Game helper functions
function randomCard() {
    const randomNumber = Math.floor(Math.random() * 13) + 1
    if (randomNumber > 10) {
        return 10
    }
    return randomNumber
}

function renderGame() {
    if (gameInfo.sum > 21 || (gameInfo.sum < gameInfo.dealerSum && gameInfo.dealerSum <= 21)) {
        playerStatusEl.textContent = "You lose!"
        gameInfo.playerState = "lost"
    } else if (gameInfo.sum === gameInfo.dealerSum) {
        playerStatusEl.textContent = "It's a tie!"
        gameInfo.playerState = "tie"
        balance += currentBet
    } else if (gameInfo.sum <= 21 && (gameInfo.sum > gameInfo.dealerSum || gameInfo.dealerSum > 21)) {
        playerStatusEl.textContent = "You win!"
        gameInfo.playerState = "won"
        balance += currentBet * 2
    }
    currentBet = 0
    balanceAmountEl.textContent = "Balance: $" + balance
    betAmountEl.textContent = "$" + currentBet
    console.log(gameInfo.playerState)
}

function bettingConfirm() {
    if (currentBet > 0 && gameInfo.bettingAllowed) {
        balance -= currentBet
        balanceAmountEl.textContent = "Balance: $" + balance
        gameInfo.bettingAllowed = false
    }
}

const game = createGame()

// Event Listeners 
gameControlEl.addEventListener("click", function() {
    game.hit()
    game.startGame()
})

standEl.addEventListener("click", function() {
    game.stand()
})

// Bet
let balance = 100
let currentBet = 0
 
betAmountEl.textContent = "$" + currentBet
balanceAmountEl.textContent = "Balance: $" + balance

betPlus10El.addEventListener("click", function() {
    if (balance - currentBet >= 10 && gameInfo.bettingAllowed) {
        currentBet += 10
        betAmountEl.textContent = "$" + currentBet
    } 
}) 

betPlus25El.addEventListener("click", function() {
    if (balance - currentBet >= 25 && gameInfo.bettingAllowed) {
        currentBet += 25
        betAmountEl.textContent = "$" + currentBet
    }
})

betMinus10El.addEventListener("click", function() {
    if (currentBet >= 10 && gameInfo.bettingAllowed) {
        currentBet -= 10
        betAmountEl.textContent = "$" + currentBet
    }
})

betMinus25El.addEventListener("click", function() {
    if (currentBet >= 25 && gameInfo.bettingAllowed) {
        currentBet -= 25
        betAmountEl.textContent = "$" + currentBet
    }
})

betConfirmEl.addEventListener("click", function() {
    bettingConfirm()
})