
import { attackers, defenders } from "./characters.js";

import { createGame } from "./gameplay.js";

import { initializeUI } from "./ui.js";


// ==========================================
// GAME MODES
// ==========================================

// Later, we can add other game modes here.
// For example: Blind Ranking, Tournament, etc.

const gameModes = {

    standard: {
        attackers,
        defenders
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
        selectedMode.attackers,
        selectedMode.defenders
    );

    initializeUI(game);

}


// ==========================================
// APPLICATION START
// ==========================================

startGame("standard");
