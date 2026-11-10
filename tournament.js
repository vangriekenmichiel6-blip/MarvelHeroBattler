import { calculateMatchup } from "./battle.js";
import { createLocationAssignments } from "./locations.js";
import { getEligibleCharacters, createTeams } from "./gameplay.js";

const BOARD_SIZE = 5;
const CHARACTERS_PER_PLAYER = 15;

export function createTournamentGame(characters, factionMode = "mixed") {
    const eligible = getEligibleCharacters(characters, factionMode);
    if (!Array.isArray(characters) || eligible.length < CHARACTERS_PER_PLAYER * 2) {
        throw new Error(`Tournament with this selection requires at least ${CHARACTERS_PER_PLAYER * 2} eligible characters.`);
    }
    if (factionMode === "heroes-villains" &&
        (eligible.filter(c => c.hero).length < CHARACTERS_PER_PLAYER ||
         eligible.filter(c => !c.hero).length < CHARACTERS_PER_PLAYER)) {
        throw new Error(`Heroes vs Villains tournament requires at least ${CHARACTERS_PER_PLAYER} heroes and ${CHARACTERS_PER_PLAYER} villains.`);
    }
    let gameState;

    function resetGame() {
        const [attackerDeck, defenderDeck] = createTeams(eligible, factionMode, CHARACTERS_PER_PLAYER);
        gameState = {
            mode: "tournament",
            factionMode,
            locations: createLocationAssignments(BOARD_SIZE),
            attackers: Array(BOARD_SIZE).fill(null),
            defenders: Array(BOARD_SIZE).fill(null),
            matchups: Array(BOARD_SIZE).fill(null),
            attackerDeck,
            defenderDeck,
            pendingCharacter: null,
            nextSide: "attacker",
            activeBattle: null,
            battleHistory: [],
            battleResults: null
        };
        drawNextCharacter();
    }

    function getGameState() {
        return gameState;
    }

    function survivors(side) {
        return gameState[side === "attacker" ? "attackers" : "defenders"]
            .filter(character => character !== null).length;
    }

    function deck(side) {
        return gameState[side === "attacker" ? "attackerDeck" : "defenderDeck"];
    }

    function hasEmptySlot(side) {
        return gameState[side === "attacker" ? "attackers" : "defenders"]
            .some(character => character === null);
    }

    function finishGame(winner, reason) {
        gameState.pendingCharacter = null;
        gameState.activeBattle = null;
        gameState.battleResults = {
            matchups: [...gameState.battleHistory],
            attackerWins: gameState.battleHistory.filter(r => r.winner === "attacker").length,
            defenderWins: gameState.battleHistory.filter(r => r.winner === "defender").length,
            draws: gameState.battleHistory.filter(r => r.winner === null).length,
            overallWinner: winner,
            reason,
            attackerSurvivors: survivors("attacker"),
            defenderSurvivors: survivors("defender")
        };
    }

    function checkGameOver() {
        const attackerAlive = survivors("attacker");
        const defenderAlive = survivors("defender");
        const attackerHasCards = deck("attacker").length > 0;
        const defenderHasCards = deck("defender").length > 0;

        if (attackerAlive === 0 && !attackerHasCards) {
            finishGame(defenderAlive > 0 || defenderHasCards ? "defender" : "draw",
                "The attackers have no characters left.");
            return true;
        }

        if (defenderAlive === 0 && !defenderHasCards) {
            finishGame(attackerAlive > 0 || attackerHasCards ? "attacker" : "draw",
                "The defenders have no characters left.");
            return true;
        }

        // Once both decks are empty, the remaining board decides the winner.
        if (!attackerHasCards && !defenderHasCards) {
            const winner = attackerAlive > defenderAlive ? "attacker" :
                defenderAlive > attackerAlive ? "defender" : "draw";
            finishGame(winner, "Both decks are empty. The surviving characters decide the result.");
            return true;
        }

        const attackerCanPlay = attackerHasCards && hasEmptySlot("attacker");
        const defenderCanPlay = defenderHasCards && hasEmptySlot("defender");
        if (!attackerCanPlay && !defenderCanPlay) {
            const winner = attackerAlive > defenderAlive ? "attacker" :
                defenderAlive > attackerAlive ? "defender" : "draw";
            finishGame(winner, "Neither side can make another placement. The surviving characters decide the result.");
            return true;
        }
        return false;
    }

    function drawNextCharacter() {
        if (gameState.pendingCharacter || gameState.activeBattle || gameState.battleResults) return;

        if (checkGameOver()) return;

        let side = gameState.nextSide;
        const other = side === "attacker" ? "defender" : "attacker";

        // Skip a side if it has no cards or no free board position.
        if (deck(side).length === 0 || !hasEmptySlot(side)) side = other;
        if (deck(side).length === 0 || !hasEmptySlot(side)) {
            checkGameOver();
            return;
        }

        const character = deck(side).pop();
        gameState.pendingCharacter = { side, character };
    }

    function placeCharacter(side, index) {
        const pending = gameState.pendingCharacter;
        if (!pending || pending.side !== side || gameState.activeBattle || gameState.battleResults) return;

        const slots = side === "attacker" ? gameState.attackers :
            side === "defender" ? gameState.defenders : null;

        if (!slots || !Number.isInteger(index) || index < 0 ||
            index >= BOARD_SIZE || slots[index] !== null) return;

        slots[index] = pending.character;
        gameState.pendingCharacter = null;
        gameState.nextSide = side === "attacker" ? "defender" : "attacker";

        const attacker = gameState.attackers[index];
        const defender = gameState.defenders[index];

        if (attacker && defender) {
            const result = calculateMatchup(attacker, defender, index, gameState.locations[index]);
            result.battleNumber = gameState.battleHistory.length + 1;
            gameState.matchups[index] = result;
            gameState.activeBattle = result;
            return;
        }

        drawNextCharacter();
    }

    function finishBattle() {
        const result = gameState.activeBattle;
        if (!result) return;

        gameState.battleHistory.push(result);
        gameState.activeBattle = null;
        gameState.matchups[result.index] = null;

        // A loser is removed. A winner stays; a draw leaves both characters.
        if (result.winner === "attacker") {
            gameState.defenders[result.index] = null;
        } else if (result.winner === "defender") {
            gameState.attackers[result.index] = null;
        } else {
            // Draw: neither character is eliminated; return both to their own shuffled decks.
            gameState.attackers[result.index] = null;
            gameState.defenders[result.index] = null;
            gameState.attackerDeck = shuffle([...gameState.attackerDeck, result.characterA]);
            gameState.defenderDeck = shuffle([...gameState.defenderDeck, result.characterB]);
        }

        if (checkGameOver()) return;
        drawNextCharacter();
    }

    resetGame();
    return { getGameState, drawNextCharacter, placeCharacter, finishBattle, resetGame };
}
