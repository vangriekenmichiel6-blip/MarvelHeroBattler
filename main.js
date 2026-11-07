
import { initializeUI } from "./ui.js";

// ==========================================
// CHARACTER DECKS
// ==========================================

const attackerCharacters = [
    "Iron Man",
    "Thor",
    "Hulk",
    "Spider-Man",
    "Captain America",
    "Black Panther",
    "Scarlet Witch",
    "Doctor Strange",
    "Ant-Man",
    "War Machine",
    "Vision",
    "Winter Soldier",
    "Captain Marvel",
    "Hawkeye",
    "Wolverine"
];

const defenderCharacters = [
    "Thanos",
    "Loki",
    "Ultron",
    "Green Goblin",
    "Red Skull",
    "Killmonger",
    "Doctor Octopus",
    "Hela",
    "Ronan",
    "Venom",
    "Mysterio",
    "Taskmaster",
    "Abomination",
    "Yellowjacket",
    "Kingpin"
];


// ==========================================
// GAME STATE
// ==========================================

let gameState;


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function shuffle(array) {

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];

    }

    return shuffled;
}


// ==========================================
// INITIALIZE GAME
// ==========================================

function resetGame() {

    gameState = {

        // Remaining characters in each deck
        attackerDeck: shuffle(attackerCharacters),
        defenderDeck: shuffle(defenderCharacters),

        // Five slots for each side
        // null means the slot is empty
        attackers: Array(5).fill(null),
        defenders: Array(5).fill(null),

        // Character drawn but not yet placed
        pendingCharacter: null,

        // Number of characters successfully placed
        drawCount: 0

    };

}


// ==========================================
// GET GAME STATE
// ==========================================

function getGameState() {
    return gameState;
}


// ==========================================
// DRAW NEXT CHARACTER
// ==========================================

function drawNextCharacter() {

    // Cannot draw if another character is waiting
    if (gameState.pendingCharacter !== null) {
        return;
    }

    // Maximum of 10 characters
    if (gameState.drawCount >= 10) {
        return;
    }

    // Alternate between attacker and defender
    const side = gameState.drawCount % 2 === 0
        ? "attacker"
        : "defender";

    const deck = side === "attacker"
        ? gameState.attackerDeck
        : gameState.defenderDeck;

    // Pick a random character
    const randomIndex = Math.floor(
        Math.random() * deck.length
    );

    const character = deck.splice(randomIndex, 1)[0];

    // Keep the character pending until placed
    gameState.pendingCharacter = {
        side,
        character
    };

}


// ==========================================
// PLACE CHARACTER IN SLOT
// ==========================================

function placeCharacter(side, index) {

    const pending = gameState.pendingCharacter;

    // There must be a character waiting
    if (pending === null) {
        return;
    }

    // Character must be placed on the correct side
    if (pending.side !== side) {
        return;
    }

    // Get the correct row of slots
    const slots = side === "attacker"
        ? gameState.attackers
        : gameState.defenders;

    // Slot must be empty
    if (slots[index] !== null) {
        return;
    }

    // Place the character
    slots[index] = pending.character;

    // Clear the pending character
    gameState.pendingCharacter = null;

    // Count the successful placement
    gameState.drawCount++;

}


// ==========================================
// START GAME
// ==========================================

resetGame();

initializeUI({

    getGameState,
    drawNextCharacter,
    placeCharacter,
    resetGame

});
