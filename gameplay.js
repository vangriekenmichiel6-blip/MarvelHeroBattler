
import { shuffle } from "./basics.js";
import { calculateMatchup } from "./battle.js";

// ==========================================
// CREATE GAME
// ==========================================

export function createGame(characters) {

    if (!Array.isArray(characters) || characters.length < 10) {
        throw new Error("createGame expects at least 10 characters.");
    }

    let shuffledCharacters = shuffle([...characters]);
    let gameState;

    // ==========================================
    // RESET GAME
    // ==========================================

    function resetGame() {

        shuffledCharacters = shuffle([...characters]);

        gameState = {
            characterDeck: [...shuffledCharacters],
            attackers: Array(5).fill(null),
            defenders: Array(5).fill(null),
            pendingCharacter: null,
            drawCount: 0,

            // Individual matchup results
            matchups: Array(5).fill(null),

            // Currently playing battle
            activeBattle: null,

            // Final results
            battleResults: null
        };

        drawNextCharacter();
    }

    function getGameState() {
        return gameState;
    }

    // ==========================================
    // DRAW NEXT CHARACTER
    // ==========================================

    function drawNextCharacter() {

        if (
            gameState.pendingCharacter !== null ||
            gameState.activeBattle !== null ||
            gameState.drawCount >= 10 ||
            gameState.characterDeck.length === 0
        ) {
            return;
        }

        const side = gameState.drawCount % 2 === 0
            ? "attacker"
            : "defender";

        const character = gameState.characterDeck.pop();

        gameState.pendingCharacter = { side, character };
    }

    // ==========================================
    // PLACE CHARACTER
    // ==========================================

    function placeCharacter(side, index) {

        const pending = gameState.pendingCharacter;

        if (
            pending === null ||
            pending.side !== side ||
            gameState.activeBattle !== null ||
            gameState.battleResults !== null
        ) {
            return;
        }

        const slots = side === "attacker"
            ? gameState.attackers
            : side === "defender"
                ? gameState.defenders
                : null;

        if (
            !slots ||
            !Number.isInteger(index) ||
            index < 0 ||
            index >= 5 ||
            slots[index] !== null
        ) {
            return;
        }

        slots[index] = pending.character;

        gameState.pendingCharacter = null;
        gameState.drawCount++;

        // Check whether this placement completes a matchup.

        const attacker = gameState.attackers[index];
        const defender = gameState.defenders[index];

        if (
            attacker !== null &&
            defender !== null &&
            gameState.matchups[index] === null
        ) {

            // Calculate the battle immediately.

            const result = calculateMatchup(
                attacker,
                defender,
                index
            );

            gameState.matchups[index] = result;
            gameState.activeBattle = result;

            return;
        }

        // No matchup completed: draw the next character.

        drawNextCharacter();
    }

    // ==========================================
    // FINISH ANIMATED BATTLE
    // ==========================================

    function finishBattle() {

        if (gameState.activeBattle === null) {
            return;
        }

        gameState.activeBattle = null;

        const completedMatchups =
            gameState.matchups.filter(result => result !== null);

        // All five battles completed.

        if (completedMatchups.length === 5) {

            const attackerWins = completedMatchups.filter(
                result => result.winner === "attacker"
            ).length;

            const defenderWins = completedMatchups.filter(
                result => result.winner === "defender"
            ).length;

            const draws = completedMatchups.filter(
                result => result.winner === null
            ).length;

            const overallWinner =
                attackerWins > defenderWins ? "attacker" :
                defenderWins > attackerWins ? "defender" :
                "draw";

            gameState.battleResults = {
                matchups: completedMatchups,
                attackerWins,
                defenderWins,
                draws,
                overallWinner
            };

            return;
        }

        // Continue the game.

        drawNextCharacter();
    }

    resetGame();

    return {
        getGameState,
        drawNextCharacter,
        placeCharacter,
        finishBattle,
        resetGame
    };
}
