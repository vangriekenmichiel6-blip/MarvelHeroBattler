
export function initializeUI(game) {

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
    // EVENT LISTENERS
    // ==========================================

    drawButton.addEventListener("click", () => {

        game.drawNextCharacter();

        render();

    });


    resetButton.addEventListener("click", () => {

        game.resetGame();

        render();

    });


    // ==========================================
    // MAIN RENDER FUNCTION
    // ==========================================

    function render() {

        const state = game.getGameState();

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

        // All characters placed
        if (finished) {

            turnText.textContent = "ALL CHARACTERS PLACED!";

            drawButton.textContent = "DRAWING COMPLETE";

            drawButton.disabled = true;

            drawStatus.textContent =
                "All ten characters are on the board.";

            return;

        }

        // Character waiting to be placed
        if (pending !== null) {

            turnText.textContent =
                `${pending.side.toUpperCase()}'S CHARACTER DRAWN`;

            drawButton.textContent = "PLACE CHARACTER";

            drawButton.disabled = true;

            drawStatus.textContent =
                `${pending.character.name} — choose an empty ${pending.side} slot.`;

            return;

        }

        // Next turn
        const nextSide = state.drawCount % 2 === 0
            ? "attacker"
            : "defender";

        turnText.textContent =
            `${nextSide.toUpperCase()}'S TURN`;

        drawButton.textContent =
            `DRAW ${nextSide.toUpperCase()}`;

        drawButton.disabled = false;

        drawStatus.textContent =
            "Draw your next character.";

    }


    // ==========================================
    // UPDATE MATCHUP GRID
    // ==========================================

    function renderMatchups(state) {

        matchupGrid.innerHTML = "";

        // Five rows, two columns
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
    // CREATE CHARACTER CARD
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


        // ==========================================
        // EMPTY CARD
        // ==========================================

        if (character === null) {

            card.classList.add("empty");

            const pending = state.pendingCharacter;

            const canPlace =
                pending !== null &&
                pending.side === side;

            if (canPlace) {

                card.classList.add("available");

                card.textContent = "PLACE HERE";

                card.disabled = false;

                card.addEventListener("click", () => {

                    game.placeCharacter(side, index);

                    render();

                });

            } else {

                card.textContent = `CARD ${index + 1}`;

                card.disabled = true;

            }

            return card;

        }


        // ==========================================
        // CHARACTER CARD
        // ==========================================

        const number = document.createElement("span");

        number.classList.add("card-number");

        number.textContent = `CARD ${index + 1}`;


        const name = document.createElement("span");

        name.classList.add("card-name");

        name.textContent = character.name;


        card.appendChild(number);
        card.appendChild(name);


        // ==========================================
        // MATCHUP STATUS
        // ==========================================

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
