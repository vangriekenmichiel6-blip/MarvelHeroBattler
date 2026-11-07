
export function initializeUI({

    getGameState,
    drawNextCharacter,
    placeCharacter,
    resetGame

}) {

    // ==========================================
    // HTML ELEMENTS
    // ==========================================

    const drawButton = document.getElementById("drawButton");
    const resetButton = document.getElementById("resetButton");

    const turnText = document.getElementById("turnText");
    const drawStatus = document.getElementById("drawStatus");

    const attackerCount = document.getElementById("attackerCount");
    const defenderCount = document.getElementById("defenderCount");

    const matchupGrid = document.getElementById("matchupGrid");


    // ==========================================
    // DRAW BUTTON
    // ==========================================

    drawButton.addEventListener("click", () => {

        drawNextCharacter();

        render();

    });


    // ==========================================
    // RESET BUTTON
    // ==========================================

    resetButton.addEventListener("click", () => {

        resetGame();

        render();

    });


    // ==========================================
    // MAIN RENDER FUNCTION
    // ==========================================

    function render() {

        const state = getGameState();

        renderDecks(state);
        renderDrawSection(state);
        renderMatchups(state);

    }


    // ==========================================
    // UPDATE DECKS
    // ==========================================

    function renderDecks(state) {

        const attackerTotal = state.attackers.filter(
            character => character !== null
        ).length;

        const defenderTotal = state.defenders.filter(
            character => character !== null
        ).length;

        attackerCount.textContent =
            `${attackerTotal} / 5 placed`;

        defenderCount.textContent =
            `${defenderTotal} / 5 placed`;

    }


    // ==========================================
    // UPDATE DRAW SECTION
    // ==========================================

    function renderDrawSection(state) {

        const pending = state.pendingCharacter;

        const finished = state.drawCount >= 10;

        // All characters have been placed
        if (finished) {

            turnText.textContent = "ALL CHARACTERS PLACED!";

            drawButton.textContent = "GAME READY";

            drawButton.disabled = true;

            drawStatus.textContent =
                "All ten characters are on the board.";

            return;

        }

        // A character has been drawn and awaits placement
        if (pending !== null) {

            turnText.textContent =
                `${pending.side.toUpperCase()} DRAWN!`;

            drawButton.textContent = "PLACE CHARACTER";

            drawButton.disabled = true;

            drawStatus.textContent =
                `${pending.character} — choose an empty ${pending.side} slot below.`;

            return;

        }

        // Waiting for the next draw
        const nextSide = state.drawCount % 2 === 0
            ? "attacker"
            : "defender";

        turnText.textContent =
            nextSide === "attacker"
                ? "ATTACKER'S TURN"
                : "DEFENDER'S TURN";

        drawButton.textContent =
            `DRAW ${nextSide.toUpperCase()}`;

        drawButton.disabled = false;

        drawStatus.textContent =
            "Draw a character to get started.";

    }


    // ==========================================
    // UPDATE MATCHUP GRID
    // ==========================================

    function renderMatchups(state) {

        matchupGrid.innerHTML = "";

        // Five rows, two cards per row
        for (let i = 0; i < 5; i++) {

            const attackerCard = createCharacterCard(
                "attacker",
                i,
                state
            );

            const defenderCard = createCharacterCard(
                "defender",
                i,
                state
            );

            matchupGrid.appendChild(attackerCard);
            matchupGrid.appendChild(defenderCard);

        }

    }


    // ==========================================
    // CREATE INDIVIDUAL CHARACTER CARD
    // ==========================================

    function createCharacterCard(side, index, state) {

        const slots = side === "attacker"
            ? state.attackers
            : state.defenders;

        const character = slots[index];

        const card = document.createElement("button");

        card.type = "button";

        card.classList.add(
            "character-card",
            side
        );

        // Is there a character waiting to be placed?
        const pending = state.pendingCharacter;

        const canPlace =
            pending !== null &&
            pending.side === side &&
            character === null;

        // Empty card
        if (character === null) {

            card.classList.add("empty");

            if (canPlace) {

                card.classList.add("available");

                card.textContent = "PLACE HERE";

                card.disabled = false;

                card.addEventListener("click", () => {

                    placeCharacter(side, index);

                    render();

                });

            } else {

                card.textContent = `CARD ${index + 1}`;

                card.disabled = true;

            }

            return card;

        }

        // Character card
        const number = document.createElement("span");

        number.classList.add("card-number");

        number.textContent = `CARD ${index + 1}`;

        const name = document.createElement("span");

        name.classList.add("card-name");

        name.textContent = character;

        card.appendChild(number);
        card.appendChild(name);

        // Check whether both sides of this row are occupied
        const matchupComplete =
            state.attackers[index] !== null &&
            state.defenders[index] !== null;

        if (matchupComplete) {

            card.classList.add("paired");

            const pairLabel = document.createElement("span");

            pairLabel.classList.add("pair-label");

            pairLabel.textContent = "MATCHUP COMPLETE";

            card.appendChild(pairLabel);

        }

        card.disabled = true;

        return card;

    }


    // ==========================================
    // INITIAL DISPLAY
    // ==========================================

    render();

}
