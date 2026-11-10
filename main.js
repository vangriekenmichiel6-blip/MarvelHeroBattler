import { loadCharacters } from "./characters.js";
import { createGame } from "./gameplay.js";
import { createTournamentGame } from "./tournament.js";
import { initializeUI } from "./ui.js";

const modeSelectScreen = document.getElementById("modeSelectScreen");
const factionSelectScreen = document.getElementById("factionSelectScreen");
const gameScreen = document.getElementById("gameScreen");
const modeButtons = document.querySelectorAll("[data-game-mode]");
const factionButtons = document.querySelectorAll("[data-faction-mode]");
const backToModes = document.getElementById("backToModesFromFaction");

let selectedGameMode = "standard";

modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedGameMode = button.dataset.gameMode;
        modeSelectScreen.hidden = true;
        factionSelectScreen.hidden = false;
    });
});

backToModes.addEventListener("click", () => {
    factionSelectScreen.hidden = true;
    modeSelectScreen.hidden = false;
});

async function startGame(factionMode) {
    try {
        const characters = await loadCharacters();
        const game = selectedGameMode === "tournament"
            ? createTournamentGame(characters, factionMode)
            : createGame(characters, factionMode);

        factionSelectScreen.hidden = true;
        gameScreen.hidden = false;
        document.getElementById("gameModeTitle").textContent =
            `${selectedGameMode === "tournament" ? "TOURNAMENT" : "5V5"} · ${factionLabel(factionMode)}`;
        initializeUI(game);
    } catch (error) {
        console.error("Failed to start game:", error);
        alert(error.message || "Could not start the game.");
    }
}

function factionLabel(mode) {
    return ({
        "heroes-villains": "HEROES VS VILLAINS",
        heroes: "HEROES ONLY",
        villains: "VILLAINS ONLY",
        mixed: "MIXED TEAMS"
    })[mode] || "MIXED TEAMS";
}

factionButtons.forEach(button => {
    button.addEventListener("click", () => startGame(button.dataset.factionMode));
});
