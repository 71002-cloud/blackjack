const playerStatusEl = document.getElementById("player-status")
const playerCardsEl = document.getElementById("player-cards")
const dealerCardsEl = document.getElementById("dealer-cards")
const totalEl = document.getElementById("total-el")
const dealerTotalEl = document.getElementById("dealer-total")
const gameControlEl = document.getElementById("game-control")
const standEl = document.getElementById("stand-el")

let playerCards = [0, 0]
let dealerCards = [0, 0]
let sum = 0
let dealerSum = 0
let isAlive = false
let hasBlackJack = false


function renderGame() {
    if (sum === 0) {
        playerStatusEl.textContent = "Start the game!"
        gameControlEl.textContent = "Start Game"
    }
    else if (sum < 21) {
        playerStatusEl.textContent = "Do you want to draw a new card?"
        gameControlEl.textContent = "Hit"
        isAlive = true
    } else if (sum === 21) {
        playerStatusEl.textContent = "You've got Blackjack! Wanna play again?"
        gameControlEl.textContent = "Play again"
        hasBlackJack = true
        isAlive = false
    } else {
        playerStatusEl.textContent = "You're lost! Wanna try again?"
        gameControlEl.textContent = "Try again"
        isAlive = false
    }
}

gameControlEl.addEventListener("click", function() {
    if (sum === 0 || hasBlackJack === true || isAlive === false) {
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
    playerCards = [0, 0]
    dealerCards = [0, 0]
    playerCards[0] = Math.floor(Math.random() * 11) + 1
    playerCards[1] = Math.floor(Math.random() * 11) + 1
    sum = playerCards[0] + playerCards[1]
    dealerCards[0] = Math.floor(Math.random() * 11) + 1
    dealerSum = dealerCards[0]

    dealerCardsEl.textContent = dealerCards.join(", ")
    dealerTotalEl.textContent = "Total: " + dealerSum + "+"
    playerCardsEl.textContent = playerCards.join(", ")
    totalEl.textContent = "Total: " + sum
}

function hit() {
    let newCard = Math.floor(Math.random() * 11) + 1
    playerCards.push(newCard)
    sum += newCard
    playerCardsEl.textContent = playerCards.join(", ")
    totalEl.textContent = "Total: " + sum
    renderGame()
}

function stand() {
    if (isAlive === true && hasBlackJack === false && dealerSum < 17) {
        dealerCards[1] = Math.floor(Math.random() * 11) + 1
        dealerSum = dealerCards[0] + dealerCards[1]
        dealerCardsEl.textContent = dealerCards.join(", ")
        dealerTotalEl.textContent = "Total: " + dealerSum
    } while (dealerSum < 17) {
        let newCard = Math.floor(Math.random() * 11) + 1
        dealerCards.push(newCard)
        dealerSum += newCard
        dealerCardsEl.textContent = dealerCards.join(", ")
        dealerTotalEl.textContent = "Total: " + dealerSum
    }
}