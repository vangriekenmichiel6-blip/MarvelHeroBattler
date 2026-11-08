import { loadCharacters } from "./characters.js";
import { createGame } from "./gameplay.js";
import { createTournamentGame } from "./tournament.js";
import { initializeUI } from "./ui.js";

const modeSelectScreen = document.getElementById("modeSelectScreen");
const gameScreen = document.getElementById("gameScreen");
const modeButtons = document.querySelectorAll("[data-game-mode]");

async function startGame(mode) {
    try {
        const characters = await loadCharacters();
        const game = mode === "tournament"
            ? createTournamentGame(characters)
            : createGame(characters);

        modeSelectScreen.hidden = true;
        gameScreen.hidden = false;
        document.getElementById("gameModeTitle").textContent =
            mode === "tournament" ? "TOURNAMENT" : "5V5";
        initializeUI(game);
    } catch (error) {
        console.error("Failed to start game:", error);
        alert(error.message || "Could not start the game.");
    }
}

modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        startGame(button.dataset.gameMode);
    });
});
