const playerStatusEl = document.getElementById("player-status")
const playerCardsEl = document.getElementById("player-cards")
const dealerCardsEl = document.getElementById("dealer-cards")
const totalEl = document.getElementById("total-el")
const dealerTotalEl = document.getElementById("dealer-total")
const gameControlEl = document.getElementById("game-control")
const standEl = document.getElementById("stand-el")

let game = {
 playerCards: [0, 0],
 dealerCards: [0, 0],
 sum: 0,
 dealerSum: 0,
 state: ""
}
let isAlive = false
let hasBlackJack = false

function renderGame() {
    if (game.sum === 0) {
        playerStatusEl.textContent = "Start the game!"
        gameControlEl.textContent = "Start Game"
    } else if (game.sum < 21) {
        playerStatusEl.textContent = "Do you want to draw a new card?"
        gameControlEl.textContent = "Hit"
        isAlive = true
    } else if (game.sum === 21) {
        playerStatusEl.textContent = "You've got Blackjack! Wanna play again?"
        gameControlEl.textContent = "Play again"
        hasBlackJack = true
        stand()
        isAlive = false
    } else if (game.sum > 21) {
        playerStatusEl.textContent = "You're out of the game! Wanna try again?"
        gameControlEl.textContent = "Try again"
        stand()
        isAlive = false
    } else {
        playerStatusEl.textContent = "You're lost! Wanna try again?"
        gameControlEl.textContent = "Try again"
        isAlive = false
    }
}

gameControlEl.addEventListener("click", function() {
    if (game.sum === 0 || hasBlackJack === true || isAlive === false) {
        renderGame()
        startGame()
        renderGame()
    } else if (isAlive === true && hasBlackJack === false) {
        hit()
    } else {
        console.log("Error")
    }
})

standEl.addEventListener("click", function() {
    stand()
})

function startGame() {
    hasBlackJack = false
    console.log(game.playerCards, game.dealerCards)
    game.playerCards = [0, 0]
    game.dealerCards = [0, 0]
    console.log(game.playerCards, game.dealerCards)
    game.playerCards[0] = Math.floor(Math.random() * 11) + 1
    game.playerCards[1] = Math.floor(Math.random() * 11) + 1
    game.sum = game.playerCards[0] + game.playerCards[1]
    game.dealerCards[0] = Math.floor(Math.random() * 11) + 1
    game.dealerSum = game.dealerCards[0]

    dealerCardsEl.textContent = game.dealerCards.join(", ")
    dealerTotalEl.textContent = "Total: " + game.dealerSum + "+"
    playerCardsEl.textContent = game.playerCards.join(", ")
    totalEl.textContent = "Total: " + game.sum
}

function hit() {
    let newCard = Math.floor(Math.random() * 11) + 1
    game.playerCards.push(newCard)
    game.sum += newCard
    playerCardsEl.textContent = game.playerCards.join(", ")
    totalEl.textContent = "Total: " + game.sum
    renderGame()
}

function stand() {
    if (isAlive === true && hasBlackJack === false && game.dealerSum < 17) {
        game.dealerCards[1] = Math.floor(Math.random() * 11) + 1
        game.dealerSum = game.dealerCards[0] + game.dealerCards[1]
        dealerCardsEl.textContent = game.dealerCards.join(", ")
        dealerTotalEl.textContent = "Total: " + game.dealerSum
        isAlive = false
    } while (game.dealerSum < 17) {
        let newCard = Math.floor(Math.random() * 11) + 1
        game.dealerCards.push(newCard)
        game.dealerSum += newCard
        dealerCardsEl.textContent = game.dealerCards.join(", ")
        dealerTotalEl.textContent = "Total: " + game.dealerSum
    }

    if (game.dealerSum < 21 && game.dealerSum > game.sum) {
        playerStatusEl.textContent = "You're lost! Wanna try again?"
        gameControlEl.textContent = "Try again"
        isAlive = false
    } else if (game.sum < 21 && game.dealerSum < game.sum) {
        playerStatusEl.textContent = "You win! Wanna play again?"
        gameControlEl.textContent = "Play again"
        isAlive = false
    } else if (game.dealerSum > 21 && game.sum > 21) {
        playerStatusEl.textContent = "You busts! Wanna play again?"
        gameControlEl.textContent = "Try again"
        isAlive = false
    } else if (game.dealerSum === game.sum) {
        playerStatusEl.textContent = "It's a tie! Wanna play again?"
        gameControlEl.textContent = "Play again"
        isAlive = false
    } else if (game.dealerSum > 21) {
        playerStatusEl.textContent = "Dealer busts! You win! Wanna play again?"
        gameControlEl.textContent = "Play again"
        isAlive = false
    }
}