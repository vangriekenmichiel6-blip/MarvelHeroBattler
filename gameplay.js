import { shuffle } from "./basics.js";
import { calculateBattles } from "./battle.js";

// ==========================================
// CREATE GAME
// ==========================================

export function createGame(characters) {
    if (!Array.isArray(characters) || characters.length < 10) {
        throw new Error("createGame expects an array containing at least 10 characters.");
    }

    let shuffledCharacters = shuffle([...characters]);
    let gameState;

    function resetGame() {
        shuffledCharacters = shuffle([...characters]);

        gameState = {
            characterDeck: [...shuffledCharacters],
            attackers: Array(5).fill(null),
            defenders: Array(5).fill(null),
            pendingCharacter: null,
            drawCount: 0,
            battleResults: null
        };
    }

    function getGameState() {
        return gameState;
    }

    function drawNextCharacter() {
        if (gameState.pendingCharacter !== null ||
            gameState.drawCount >= 10 ||
            gameState.characterDeck.length === 0) {
            return;
        }

        const side = gameState.drawCount % 2 === 0
            ? "attacker"
            : "defender";

        const character = gameState.characterDeck.pop();

        gameState.pendingCharacter = { side, character };
    }

    function placeCharacter(side, index) {
        const pending = gameState.pendingCharacter;

        if (pending === null || pending.side !== side || gameState.battleResults !== null) {
            return;
        }

        const slots = side === "attacker"
            ? gameState.attackers
            : side === "defender"
                ? gameState.defenders
                : null;

        if (!slots ||
            !Number.isInteger(index) ||
            index < 0 ||
            index >= 5 ||
            slots[index] !== null) {
            return;
        }

        slots[index] = pending.character;
        gameState.pendingCharacter = null;
        gameState.drawCount++;

        // The five adjacent pairs are now fixed. Calculate all battles.
        if (gameState.drawCount === 10) {
            gameState.battleResults = calculateBattles(
                gameState.attackers,
                gameState.defenders
            );
        }
    }

    resetGame();

    return {
        getGameState,
        drawNextCharacter,
        placeCharacter,
        resetGame
    };
}
