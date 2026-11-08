export function initializeUI(game) {
    const resetButton = document.getElementById("resetButton");
    const turnText = document.getElementById("turnText");
    const drawStatus = document.getElementById("drawStatus");
    const attackerCount = document.getElementById("attackerCount");
    const defenderCount = document.getElementById("defenderCount");
    const matchupGrid = document.getElementById("matchupGrid");
    const battleResultsSection = document.getElementById("battleResults");
    const battleSummary = document.getElementById("battleSummary");
    const matchupResults = document.getElementById("matchupResults");
    const currentCharacter = document.getElementById("currentCharacter");

    resetButton.addEventListener("click", () => {
        game.resetGame();
        render();
    });

    function render() {
        const state = game.getGameState();
        renderDecks(state);
        renderDrawSection(state);
        renderMatchups(state);
        renderBattleResults(state);
    }

    function renderDecks(state) {
        attackerCount.textContent =
            `${state.attackers.filter(character => character !== null).length} / 5 placed`;

        defenderCount.textContent =
            `${state.defenders.filter(character => character !== null).length} / 5 placed`;
    }

    
    function renderDrawSection(state) {
        const pending = state.pendingCharacter;
        const finished = state.drawCount >= 10;

        currentCharacter.innerHTML = "";

        if (finished) {
            turnText.textContent = "BATTLES COMPLETE!";
            drawStatus.textContent = "All five matchups have been calculated.";
            return;
        }

        const side = pending.side;
        const character = pending.character;

        turnText.textContent = `${side.toUpperCase()}'S CHARACTER`;

        drawStatus.textContent =
            `Place ${character.name} in an empty ${side} slot.`;

        // Character image
        const image = document.createElement("img");
        image.className = "drawn-character-image";
        image.alt = character.name;
        image.src = character.imageURL || "";

        if (!character.imageURL) {
            image.hidden = true;
        }

        image.onerror = () => {
            image.hidden = true;
        };

        // Character name
        const name = document.createElement("span");
        name.className = "drawn-character-name";
        name.textContent = character.name;

        currentCharacter.append(image, name);
    }


    function renderMatchups(state) {
        matchupGrid.innerHTML = "";

        for (let i = 0; i < 5; i++) {
            matchupGrid.appendChild(createCharacterCard("attacker", i, state));
            matchupGrid.appendChild(createCharacterCard("defender", i, state));
        }
    }

    function createCharacterCard(side, index, state) {
        const slots = side === "attacker" ? state.attackers : state.defenders;
        const character = slots[index];
        const result = state.battleResults?.matchups[index];

        const card = document.createElement("button");
        card.type = "button";
        card.classList.add("character-card", side);

        if (character === null) {
            card.classList.add("empty");

            const pending = state.pendingCharacter;
            const canPlace = pending !== null && pending.side === side;

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

        const number = document.createElement("span");
        number.className = "card-number";
        number.textContent = `MATCHUP ${index + 1}`;

        const image = document.createElement("img");
        image.className = "character-image";
        image.alt = character.name;
        image.src = character.imageURL || "";
        image.loading = "lazy";
        image.onerror = () => {
            image.hidden = true;
        };
        if (!character.imageURL) image.hidden = true;

        const name = document.createElement("span");
        name.className = "card-name";
        name.textContent = character.name;

        card.append(number, image, name);

        if (result) {
            const won = result.winner === side;
            const draw = result.winner === null;

            if (result.closeBattle) {
                card.classList.add("close-battle-card");
            }

            card.classList.add(draw ? "result-draw" : won ? "result-win" : "result-loss");

            const outcome = document.createElement("span");
            outcome.className = "pair-label";
            const againstAllOdds = result.againstAllOdds && won;

            outcome.textContent = draw
                ? "DRAW"
                : againstAllOdds
                    ? "AGAINST ALL ODDS!"
                    : won
                        ? "WON MATCHUP"
                        : "LOST MATCHUP";

            if (againstAllOdds) {
                card.classList.add("against-odds-card");
            }
            
            card.appendChild(outcome);
        } else if (state.attackers[index] !== null && state.defenders[index] !== null) {
            card.classList.add("paired");
            const pairLabel = document.createElement("span");
            pairLabel.className = "pair-label";
            pairLabel.textContent = "MATCHUP READY";
            card.appendChild(pairLabel);
        }

        card.disabled = true;
        return card;
    }

    function renderBattleResults(state) {
        const results = state.battleResults;

        if (!results) {
            battleResultsSection.hidden = true;
            return;
        }

        battleResultsSection.hidden = false;
        matchupResults.innerHTML = "";

        results.matchups.forEach(result => {
            const row = document.createElement("div");
            row.className = "result-row";

            const names = document.createElement("span");
            names.className = "result-names";
            names.textContent =
                `${result.characterA.name} vs ${result.characterB.name}`;

            const outcome = document.createElement("span");
            outcome.className = "result-outcome";

            if (result.winner === "attacker") {

                if (result.againstAllOdds) {
                    outcome.textContent =
                        `Against all odds, ${result.characterA.name} won the match!`;
                    outcome.classList.add("against-odds-result");
                } else {
                    outcome.textContent = `${result.characterA.name} wins`;
                    outcome.classList.add("attacker-result");
                }

            } else if (result.winner === "defender") {

                if (result.againstAllOdds) {
                    outcome.textContent =
                        `Against all odds, ${result.characterB.name} won the match!`;
                    outcome.classList.add("against-odds-result");
                } else {
                    outcome.textContent = `${result.characterB.name} wins`;
                    outcome.classList.add("defender-result");
                }

            } else {

                outcome.textContent = "Draw";
                outcome.classList.add("draw-result");

            }

            row.append(names, outcome);

            // Show close battle indicator
            if (result.closeBattle) {
                const closeLabel = document.createElement("span");
                closeLabel.className = "close-battle-label";
                closeLabel.textContent = "⚡ CLOSE BATTLE!";
                row.appendChild(closeLabel);
            }

            matchupResults.appendChild(row);
        });

        if (results.overallWinner === "attacker") {
            battleSummary.textContent =
                `ATTACKERS WIN ${results.attackerWins}–${results.defenderWins}`;
            battleSummary.className = "battle-summary attacker-result";
        } else if (results.overallWinner === "defender") {
            battleSummary.textContent =
                `DEFENDERS WIN ${results.defenderWins}–${results.attackerWins}`;
            battleSummary.className = "battle-summary defender-result";
        } else {
            battleSummary.textContent =
                `THE BATTLE IS A DRAW ${results.attackerWins}–${results.defenderWins}`;
            battleSummary.className = "battle-summary draw-result";
        }

        if (results.draws > 0) {
            battleSummary.textContent += ` (${results.draws} matchup${results.draws === 1 ? "" : "s"} tied)`;
        }
    }

    render();
}
