
import { characters } from "./characters.js";

import { createGame } from "./gameplay.js";

import { initializeUI } from "./ui.js";


// ==========================================
// GAME MODES
// ==========================================

// Later, we can add other game modes here.
// For example: Blind Ranking, Tournament, etc.

const gameModes = {

    standard: {
        characters
    }

};


// ==========================================
// START GAME
// ==========================================

function startGame(mode = "standard") {

    const selectedMode = gameModes[mode];

    if (!selectedMode) {
        console.error("Unknown game mode:", mode);
        return;
    }

    const game = createGame(
        selectedMode.characters
    );

    initializeUI(game);

}


// ==========================================
// APPLICATION START
// ==========================================

startGame("standard");
