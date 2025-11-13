import { supabase } from "./supabaseclient"
import imgDuckUrl from "./assets/images/rubberduck-tophat.png"

export async function initBlackjack() {
    // Game Elements 
    const playerStatusEl = document.getElementById("player-status")
    const playerCardsEl = document.getElementById("player-cards")
    const dealerCardsEl = document.getElementById("dealer-cards")
    const totalEl = document.getElementById("total-el")
    const dealerTotalEl = document.getElementById("dealer-total")
    const gameStartEl = document.getElementById("game-start-el")
    const hitEl = document.getElementById("hit-el")
    const standEl = document.getElementById("stand-el")
    // Bet Elements
    const betAmountEl = document.getElementById("bet-amount")
    const balanceAmountEl = document.getElementById("balance-amount-el")
    const betPlus10El = document.getElementById("bet-plus-10")
    const betPlus25El = document.getElementById("bet-plus-25")
    const betMinus10El = document.getElementById("bet-minus-10")
    const betMinus25El = document.getElementById("bet-minus-25")
    const betAllInEl = document.getElementById("bet-all-in")
    const rubberDuckEl = document.getElementById("rubberduck")
    // Confetti Elements
    const canvas = document.getElementById('confettiCanvas');

    const logOutBtn = document.getElementById("log-out-btn")

    const itemFromStorage = localStorage.getItem("sb-sazsvscjrkwpjwsnvvtc-auth-token")
    const itemFromStorageToNoraml = JSON.parse(itemFromStorage)
    const id = itemFromStorageToNoraml.user.id

    logOutBtn.addEventListener("click", async function() {
        const { error } = await supabase.auth.signOut({ scope: 'local' })
        console.log("log out")
    })

    async function getData() {
    const { data, error } = await supabase
        .from('players')
        .select('balance')

    if (error) {
        console.error('Error fetching data:', error)
        return
    }

    return data[0].balance
    }

    async function updateBal() {
    const { data, error } = await supabase
        .from('players')
        .update({ balance: gameInfo.balance})
        .eq('user_id', id)
        .select('*')


    if (error) {
        console.error('Error fetching data:', error)
        return
    }
    }

    // Game Info
    let gameInfo = {
    playerCards: [],
    dealerCards: [],
    sum: 0,
    dealerSum: 0,
    renderWinCondition: "",
    bettingAllowed: false,
    balance: await getData(),
    currentBet: 0
    }

    const deck = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]

    // Game
    function createGame() {

        hitEl.style = 'display: none;'
        betAmountEl.textContent = "$" + gameInfo.currentBet
        balanceAmountEl.textContent = "Balance: $" + gameInfo.balance

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
            enter (setState) {
                gameStartEl.style = "display: inline-block;"
                hitEl.style = "display: none;"
            },
            async startGame(setState) {
                bettingConfirm()
                playerStatusEl.textContent = "Game started"
                gameStartEl.style = "display: none;"
                hitEl.style = "display: inline-block;"
    
                gameInfo.playerCards = [randomCard(), randomCard()]
                gameInfo.sum = handValue(gameInfo.playerCards)
                totalEl.textContent = "Total: " + gameInfo.sum
                playerCardsEl.textContent = gameInfo.playerCards.join(", ")

                gameInfo.dealerCards = [randomCard()]
                dealerCardsEl.textContent = gameInfo.dealerCards.join(", ")
                gameInfo.dealerSum = handValue(gameInfo.dealerCards)
                dealerTotalEl.textContent = "Total: " + gameInfo.dealerSum + "+"

                await slowDown(500)
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
                gameInfo.sum = handValue(gameInfo.playerCards)
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
            async enter(setState) {
                playerStatusEl.textContent = "Player stands"
                await slowDown(1000)
                playerStatusEl.textContent = "Dealer's turn"
                const newCard = randomCard()
                gameInfo.dealerCards.push(newCard)
                gameInfo.dealerSum = handValue(gameInfo.dealerCards)
                dealerCardsEl.textContent = gameInfo.dealerCards.join(", ")
                dealerTotalEl.textContent = "Total: " + gameInfo.dealerSum

                while (gameInfo.dealerSum < 17) {
                await slowDown(1000)
                const newCard = randomCard()
                gameInfo.dealerCards.push(newCard)
                gameInfo.dealerSum = handValue(gameInfo.dealerCards)
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
        const card = deck[Math.floor(Math.random() * 13)]
        return card
    }

    function cardValue(card) {
        if (card === "A") return 11
        if (["J", "Q", "K"].includes(card)) return 10
        return card
    }

    function handValue(hand) {
        let total = 0
        let aces = 0

        for (let card of hand) {
            let value = cardValue(card)
            total += value
            if (card === "A") aces++
        }

        while (total > 21 && aces > 0) {
            total -= 10
            aces--
        }

        return total
    }

    function renderGame() {
        if (gameInfo.sum > 21 || (gameInfo.sum < gameInfo.dealerSum && gameInfo.dealerSum <= 21)) {
            playerStatusEl.textContent = "You lose!"
        } else if (gameInfo.sum === gameInfo.dealerSum) {
            playerStatusEl.textContent = "It's a tie!"
            gameInfo.balance += gameInfo.currentBet
        } else if (gameInfo.sum <= 21 && (gameInfo.sum > gameInfo.dealerSum || gameInfo.dealerSum > 21)) {
            playerStatusEl.textContent = "You win!"
            gameInfo.balance += gameInfo.currentBet * 2,
            confettiLauncher()
        }
        gameInfo.currentBet = 0
        balanceAmountEl.textContent = "Balance: $" + gameInfo.balance
        betAmountEl.textContent = "$" + gameInfo.currentBet
        updateBal()
    }

    function bettingConfirm() {
        if (gameInfo.bettingAllowed) {
            gameInfo.balance -= gameInfo.currentBet
            balanceAmountEl.textContent = "Balance: $" + gameInfo.balance
            gameInfo.bettingAllowed = false
        }
    }

    function slowDown (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const game = createGame()

    // Event Listeners
    gameStartEl.addEventListener("click", function() {
        game.startGame()
    })

    hitEl.addEventListener("click", function() {
        game.hit()
    })

    standEl.addEventListener("click", function() {
        game.stand()
    })

    betPlus10El.addEventListener("click", function() {
        if (gameInfo.balance - gameInfo.currentBet >= 10 && gameInfo.bettingAllowed) {
            gameInfo.currentBet += 10
            betAmountEl.textContent = "$" + gameInfo.currentBet
        } 
    }) 

    betPlus25El.addEventListener("click", function() {
        if (gameInfo.balance - gameInfo.currentBet >= 25 && gameInfo.bettingAllowed) {
            gameInfo.currentBet += 25
            betAmountEl.textContent = "$" + gameInfo.currentBet
        }
    })

    betMinus10El.addEventListener("click", function() {
        if (gameInfo.currentBet >= 10 && gameInfo.bettingAllowed) {
            gameInfo.currentBet -= 10
            betAmountEl.textContent = "$" + gameInfo.currentBet
        }
    })

    betMinus25El.addEventListener("click", function() {
        if (gameInfo.currentBet >= 25 && gameInfo.bettingAllowed) {
            gameInfo.currentBet -= 25
            betAmountEl.textContent = "$" + gameInfo.currentBet
        }
    })

    betAllInEl.addEventListener("click", function() {
        if (gameInfo.bettingAllowed) {
            gameInfo.currentBet = gameInfo.balance
            betAmountEl.textContent = "$" + gameInfo.currentBet
        }
    })

    rubberDuckEl.addEventListener("click", function() {
        if (gameInfo.currentBet === 0 && gameInfo.balance === 0) {
            gameInfo.balance = 100
            balanceAmountEl.textContent = "Balance: $" + gameInfo.balance
            updateBal()
        }
    })

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const confettiImg = new Image();
    confettiImg.src = imgDuckUrl;
    const confetti = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 30 + 20;
            this.speed = Math.random() * 10 + 2;
            this.gravity = 0.1;
            this.rotation = Math.random() * 2 * Math.PI;
            this.rotationSpeed = Math.random() * 0.1 - 0.05;
        }

        update() {
            this.y += this.speed;
            this.x += Math.sin(this.rotation) * 2;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height) this.y = -this.size;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(confettiImg, -this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    function createConfetti(count) {
        for (let i = 0; i < count; i++) {
            confetti.push(new Particle());
        }
    }

    function animate(duration) {
            const startTime = performance.now();
            function loop(currentTime) {
                const elapsed = currentTime - startTime;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                confetti.forEach(p => {
                p.update();
                p.draw();
                });

                if (elapsed < duration) {
                requestAnimationFrame(loop);
                } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }

        requestAnimationFrame(loop);
    }

    function confettiLauncher() {
            createConfetti(100);
            animate(3500);
    }
}