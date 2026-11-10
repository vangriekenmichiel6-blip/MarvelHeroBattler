import { shuffle } from "./basics.js";
import { calculateMatchup } from "./battle.js";
import { createLocationAssignments } from "./locations.js";

export function createGame(characters, factionMode = "mixed") {
    const eligible = getEligibleCharacters(characters, factionMode);
    if (eligible.length < 10) {
        throw new Error(`5v5 with this selection requires at least 10 eligible characters. Found ${eligible.length}.`);
    }
    if (factionMode === "heroes-villains" &&
        (eligible.filter(c => c.hero).length < 5 || eligible.filter(c => !c.hero).length < 5)) {
        throw new Error("Heroes vs Villains requires at least 5 heroes and 5 villains.");
    }

    let gameState;

    function resetGame() {
        const [attackerDeck, defenderDeck] = createTeams(eligible, factionMode, 5);
        gameState = {
            mode: "standard",
            factionMode,
            attackers: Array(5).fill(null),
            defenders: Array(5).fill(null),
            attackerDeck,
            defenderDeck,
            pendingCharacter: null,
            drawCount: 0,
            locations: createLocationAssignments(5),
            matchups: Array(5).fill(null),
            activeBattle: null,
            battleResults: null
        };
        drawNextCharacter();
    }

    function getGameState() { return gameState; }

    function drawNextCharacter() {
        if (gameState.pendingCharacter || gameState.activeBattle ||
            gameState.battleResults || gameState.drawCount >= 10) return;

        const side = gameState.drawCount % 2 === 0 ? "attacker" : "defender";
        const deck = side === "attacker" ? gameState.attackerDeck : gameState.defenderDeck;
        if (!deck.length) return;
        gameState.pendingCharacter = { side, character: deck.pop() };
    }

    function placeCharacter(side, index) {
        const pending = gameState.pendingCharacter;
        if (!pending || pending.side !== side || gameState.activeBattle ||
            gameState.battleResults) return;

        const slots = side === "attacker" ? gameState.attackers :
            side === "defender" ? gameState.defenders : null;
        if (!slots || !Number.isInteger(index) || index < 0 || index >= 5 || slots[index]) return;

        slots[index] = pending.character;
        gameState.pendingCharacter = null;
        gameState.drawCount++;

        const attacker = gameState.attackers[index];
        const defender = gameState.defenders[index];
        if (attacker && defender && !gameState.matchups[index]) {
            const result = calculateMatchup(attacker, defender, index, gameState.locations[index]);
            gameState.matchups[index] = result;
            gameState.activeBattle = result;
            return;
        }
        drawNextCharacter();
    }

    function finishBattle() {
        if (!gameState.activeBattle) return;
        gameState.activeBattle = null;
        const completed = gameState.matchups.filter(Boolean);

        if (completed.length === 5) {
            const attackerWins = completed.filter(r => r.winner === "attacker").length;
            const defenderWins = completed.filter(r => r.winner === "defender").length;
            const draws = completed.filter(r => r.winner === null).length;
            gameState.battleResults = {
                matchups: completed, attackerWins, defenderWins, draws,
                overallWinner: attackerWins > defenderWins ? "attacker" :
                    defenderWins > attackerWins ? "defender" : "draw"
            };
            return;
        }
        drawNextCharacter();
    }

    resetGame();
    return { getGameState, drawNextCharacter, placeCharacter, finishBattle, resetGame };
}

export function getEligibleCharacters(characters, factionMode) {
    if (factionMode === "heroes") return characters.filter(c => c.hero);
    if (factionMode === "villains") return characters.filter(c => !c.hero);
    return characters;
}

export function createTeams(characters, factionMode, teamSize) {
    if (factionMode === "heroes-villains") {
        const heroes = shuffle(characters.filter(c => c.hero));
        const villains = shuffle(characters.filter(c => !c.hero));
        if (heroes.length < teamSize || villains.length < teamSize) {
            throw new Error(`Heroes vs Villains requires at least ${teamSize} heroes and ${teamSize} villains.`);
        }
        return [heroes.slice(0, teamSize), villains.slice(0, teamSize)];
    }

    const shuffled = shuffle([...characters]);
    if (shuffled.length < teamSize * 2) {
        throw new Error(`This game mode requires at least ${teamSize * 2} eligible characters.`);
    }
    return [shuffled.slice(0, teamSize), shuffled.slice(teamSize, teamSize * 2)];
}
