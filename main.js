
import { loadCharacters } from "./characters.js";

import { createGame } from "./gameplay.js";

import { initializeUI } from "./ui.js";


// ==========================================
// GAME MODES
// ==========================================

// Later, we can add other game modes here.
// For example: Blind Ranking, Tournament, etc.

const gameModes = {

    standard: {
        loadCharacters
    }

};


// ==========================================
// START GAME
// ==========================================

async function startGame(mode = "standard") {

    const selectedMode = gameModes[mode];

    if (!selectedMode) {
        console.error("Unknown game mode:", mode);
        return;
    }

    // Load characters from CSV
    const characters = await selectedMode.loadCharacters();

    console.log("Loaded characters:", characters);

    // Create game using the loaded characters
    const game = createGame(characters);

    initializeUI(game);

}

// ==========================================
// APPLICATION START
// ==========================================

startGame("standard").catch(error => {
    console.error("Failed to start game:", error);
});
