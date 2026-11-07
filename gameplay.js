console.log("GAMEPLAY.JS LOADED");

import { shuffle } from "./basics.js";

// ==========================================
// CREATE GAME
// ==========================================

export function createGame(attackerCharacters, defenderCharacters) {

    let gameState;


    // ==========================================
    // RESET GAME
    // ==========================================

    function resetGame() {

        gameState = {

            // Remaining characters in each deck
            attackerDeck: shuffle(attackerCharacters),
            defenderDeck: shuffle(defenderCharacters),

            // Five slots for each side
            attackers: Array(5).fill(null),
            defenders: Array(5).fill(null),

            // Character waiting to be placed
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
        console.log("DRAW FUNCTION CALLED");

        // Cannot draw while another character is waiting
        if (gameState.pendingCharacter !== null) {
            return;
        }

        // All ten characters have been placed
        if (gameState.drawCount >= 10) {
            return;
        }

        // Alternate between attackers and defenders
        const side = gameState.drawCount % 2 === 0
            ? "attacker"
            : "defender";

        const deck = side === "attacker"
            ? gameState.attackerDeck
            : gameState.defenderDeck;

        // Draw random character
        const randomIndex = Math.floor(
            Math.random() * deck.length
        );

        const character = deck.splice(randomIndex, 1)[0];

        console.log("DRAWN CHARACTER:", character);
        console.log("CHARACTER NAME:", character.name);   

        // Store character until player places it
        gameState.pendingCharacter = {
            side,
            character
        };

    }


    // ==========================================
    // PLACE CHARACTER
    // ==========================================

    function placeCharacter(side, index) {

        const pending = gameState.pendingCharacter;

        // There must be a character waiting
        if (pending === null) {
            return;
        }

        // Must place on the correct side
        if (pending.side !== side) {
            return;
        }

        // Get the correct slots
        const slots = side === "attacker"
            ? gameState.attackers
            : gameState.defenders;

        // Check that the slot exists and is empty
        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= 5 ||
            slots[index] !== null
        ) {
            return;
        }

        // Place character
        slots[index] = pending.character;

        // Clear pending character
        gameState.pendingCharacter = null;

        // Count successful placement
        gameState.drawCount++;

    }


    // ==========================================
    // INITIALIZE
    // ==========================================

    resetGame();


    // ==========================================
    // PUBLIC GAME FUNCTIONS
    // ==========================================

    return {

        getGameState,
        drawNextCharacter,
        placeCharacter,
        resetGame

    };

}
