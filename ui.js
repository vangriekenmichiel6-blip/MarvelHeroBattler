import { animateBattle } from "./battleAnimation.js";

export function initializeUI(game) {

    // ==========================================
    // EXISTING ELEMENTS
    // ==========================================

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
    const boardTitle = document.getElementById("boardTitle");
    const battleResultsTitle = document.getElementById("battleResultsTitle");

    // ==========================================
    // BATTLE POPUP ELEMENTS
    // ==========================================

    const battlePopup = document.getElementById("battlePopup");
    const battleTitle = document.getElementById("battleTitle");
    const battleImageA = document.getElementById("battleImageA");
    const battleImageB = document.getElementById("battleImageB");
    const battleNameA = document.getElementById("battleNameA");
    const battleNameB = document.getElementById("battleNameB");
    const battleLabelA = document.getElementById("battleLabelA");
    const battleLabelB = document.getElementById("battleLabelB");
    const battleBar = document.getElementById("battleBar");
    const battleStatus = document.getElementById("battleStatus");
    const continueBattleButton =
        document.getElementById("continueBattleButton");
    const winnerPopup = document.getElementById("winnerPopup");
    const winnerTitle = document.getElementById("winnerTitle");
    const winnerMessage = document.getElementById("winnerMessage");
    const winnerCloseButton = document.getElementById("winnerCloseButton");
    const backToModesButton = document.getElementById("backToModesButton");

    let currentBattle = null;
    let animationToken = 0;
    let winnerPopupDismissed = false;

    // ==========================================
    // RESET
    // ==========================================

    resetButton.addEventListener("click", () => {

        animationToken++;
        currentBattle = null;

        game.resetGame();
        winnerPopupDismissed = false;
        battlePopup.hidden = true;
        winnerPopup.hidden = true;
        render();
    });

    continueBattleButton.addEventListener("click", () => {
        game.finishBattle();
        currentBattle = null;
        render();
    });

    winnerCloseButton.addEventListener("click", () => {
        winnerPopupDismissed = true;
        winnerPopup.hidden = true;
    });

    backToModesButton.addEventListener("click", () => window.location.reload());

    // ==========================================
    // RENDER EVERYTHING
    // ==========================================

    function render() {

        const state = game.getGameState();

        boardTitle.textContent = state.mode === "tournament"
            ? "TOURNAMENT BOARD"
            : "YOUR MATCHUPS";
        battleResultsTitle.textContent = state.mode === "tournament"
            ? "BATTLE HISTORY"
            : "BATTLE RESULTS";

        renderDecks(state);
        renderDrawSection(state);
        renderMatchups(state);
        renderBattleResults(state);
        renderBattlePopup(state);
        renderWinnerPopup(state);
    }

    // ==========================================
    // DECKS
    // ==========================================

    function renderDecks(state) {

        if (state.mode === "tournament") {
            attackerCount.textContent =
                `${state.attackerDeck.length} cards left · ${state.attackers.filter(c => c !== null).length} surviving`;
            defenderCount.textContent =
                `${state.defenderDeck.length} cards left · ${state.defenders.filter(c => c !== null).length} surviving`;
        } else {
            attackerCount.textContent =
                `${state.attackers.filter(c => c !== null).length} / 5 placed`;
            defenderCount.textContent =
                `${state.defenders.filter(c => c !== null).length} / 5 placed`;
        }
    }

    // ==========================================
    // DRAW SECTION
    // ==========================================

    function renderDrawSection(state) {

        const pending = state.pendingCharacter;
        const finished = state.battleResults !== null;

        currentCharacter.innerHTML = "";

        if (state.activeBattle !== null) {

            turnText.textContent = "BATTLE IN PROGRESS!";
            drawStatus.textContent =
                "Watch the battle unfold...";

            return;
        }

        if (finished) {
            turnText.textContent = "GAME OVER!";
            drawStatus.textContent = "The game has ended.";
            return;
        }

        if (pending === null) return;

        const side = pending.side;
        const character = pending.character;

        turnText.textContent = `${side.toUpperCase()}'S CHARACTER`;

        drawStatus.textContent = state.mode === "tournament"
            ? `Place ${character.name} in an empty ${side} position.`
            : `Place ${character.name} in an empty ${side} slot.`;

        const image = document.createElement("img");
        image.className = "drawn-character-image";
        image.alt = character.name;
        image.src = character.imageURL || "";

        if (!character.imageURL) image.hidden = true;

        image.onerror = () => {
            image.hidden = true;
        };

        const name = document.createElement("span");
        name.className = "drawn-character-name";
        name.textContent = character.name;

        currentCharacter.append(image, name);
    }

    // ==========================================
    // MATCHUP GRID
    // ==========================================

    function renderMatchups(state) {

        matchupGrid.innerHTML = "";

        for (let i = 0; i < 5; i++) {

            matchupGrid.appendChild(createCharacterCard("attacker", i, state));
            matchupGrid.appendChild(createLocationCard(i, state.locations?.[i] || null));
            matchupGrid.appendChild(createCharacterCard("defender", i, state));
        }
    }

    function createLocationCard(index, location) {
        const card = document.createElement("div");
        card.className = location ? "location-card" : "location-card location-none";

        if (!location) {
            card.textContent = "NO LOCATION";
            return card;
        }

        const image = document.createElement("img");
        image.src = location.imageURL || "";
        image.alt = location.name;
        image.loading = "lazy";
        image.onerror = () => { image.hidden = true; };

        const name = document.createElement("span");
        name.className = "location-name";
        name.textContent = location.name;

        const info = document.createElement("button");
        info.type = "button";
        info.className = "location-info";
        info.textContent = "ⓘ";
        info.title = `About ${location.name}`;
        info.setAttribute("aria-label", `Description of ${location.name}`);
        info.addEventListener("click", () => {
            window.alert(`${location.name}\\n\\n${location.description}`);
        });

        card.append(image, name, info);
        return card;
    }

    function createCharacterCard(side, index, state) {

        const slots = side === "attacker"
            ? state.attackers
            : state.defenders;

        const character = slots[index];
        const result = state.matchups[index];

        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("character-card", side);

        // EMPTY SLOT

        if (character === null) {

            card.classList.add("empty");

            const pending = state.pendingCharacter;

            const canPlace =
                pending !== null &&
                pending.side === side &&
                state.activeBattle === null;

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

        // CHARACTER CARD

        const number = document.createElement("span");
        number.className = "card-number";
        number.textContent = `MATCHUP ${index + 1}`;

        const image = document.createElement("img");
        image.className = "character-image";
        image.alt = character.name;
        image.src = character.imageURL || "";
        image.loading = "lazy";

        if (!character.imageURL) image.hidden = true;

        image.onerror = () => {
            image.hidden = true;
        };

        const name = document.createElement("span");
        name.className = "card-name";
        name.textContent = character.name;

        card.append(number, image, name);

        // BATTLE RESULT

        if (result) {

            const won = result.winner === side;
            const draw = result.winner === null;

            if (result.closeBattle) {
                card.classList.add("close-battle-card");
            }

            card.classList.add(
                draw ? "result-draw" :
                won ? "result-win" :
                "result-loss"
            );

            const outcome = document.createElement("span");
            outcome.className = "pair-label";

            if (draw) {

                outcome.textContent = "DRAW";

            } else if (won && result.againstAllOdds) {

                outcome.textContent = "AGAINST ALL ODDS!";

                card.classList.add("against-odds-card");

            } else {

                outcome.textContent =
                    won ? "WON MATCHUP" : "LOST MATCHUP";

            }

            card.appendChild(outcome);

        } else if (
            state.attackers[index] !== null &&
            state.defenders[index] !== null
        ) {

            card.classList.add("paired");

            const pairLabel = document.createElement("span");
            pairLabel.className = "pair-label";
            pairLabel.textContent = "MATCHUP READY";

            card.appendChild(pairLabel);
        }

        card.disabled = true;

        return card;
    }

    // ==========================================
    // BATTLE POPUP
    // ==========================================

    function renderBattlePopup(state) {

        const result = state.activeBattle;

        if (result === null) {

            battlePopup.hidden = true;
            return;
        }

        // Don't restart an existing animation.

        if (result === currentBattle) return;

        currentBattle = result;

        const token = ++animationToken;

        battlePopup.hidden = false;

        battleTitle.textContent =
            result.location
                ? `MATCHUP ${result.index + 1} · ${result.location.name.toUpperCase()}`
                : `MATCHUP ${result.index + 1}`;

        battleNameA.textContent = result.characterA.name;
        battleNameB.textContent = result.characterB.name;

        battleLabelA.textContent = result.characterA.name;
        battleLabelB.textContent = result.characterB.name;

        battleImageA.src = result.characterA.imageURL || "";
        battleImageB.src = result.characterB.imageURL || "";

        battleImageA.hidden = !result.characterA.imageURL;
        battleImageB.hidden = !result.characterB.imageURL;

        battleImageA.onerror = () => {
            battleImageA.hidden = true;
        };

        battleImageB.onerror = () => {
            battleImageB.hidden = true;
        };

        battleStatus.textContent = "THE BATTLE IS ON!";

        battleStatus.className = "";

        continueBattleButton.hidden = true;

        // Start bar in the middle.

        battleBar.style.transition = "none";
        battleBar.style.width = "50%";

        animateBattle(
            result,
            token,
            () => animationToken,
            {
                battleBar,
                battleStatus,
                continueBattleButton
            }
        );
    }

    // ==========================================
    // FINAL BATTLE RESULTS
    // ==========================================

    function renderBattleResults(state) {
        const results = state.battleResults;
        const history = state.mode === "tournament"
            ? state.battleHistory
            : (results ? results.matchups : []);

        if (!results && history.length === 0) {
            battleResultsSection.hidden = true;
            return;
        }

        battleResultsSection.hidden = false;
        matchupResults.innerHTML = "";

        if (state.mode === "tournament" && !results) {
            battleSummary.textContent = `${history.length} BATTLE${history.length === 1 ? "" : "S"} FOUGHT`;
            battleSummary.className = "battle-summary";
        } else if (results) {
            if (results.overallWinner === "attacker") {
                battleSummary.textContent = `ATTACKERS WIN ${results.attackerWins}–${results.defenderWins}`;
                battleSummary.className = "battle-summary attacker-result";
            } else if (results.overallWinner === "defender") {
                battleSummary.textContent = `DEFENDERS WIN ${results.defenderWins}–${results.attackerWins}`;
                battleSummary.className = "battle-summary defender-result";
            } else {
                battleSummary.textContent = `THE BATTLE IS A DRAW ${results.attackerWins}–${results.defenderWins}`;
                battleSummary.className = "battle-summary draw-result";
            }
            if (results.draws > 0) {
                battleSummary.textContent += ` (${results.draws} matchup${results.draws === 1 ? "" : "s"} tied)`;
            }
        }

        history.forEach(result => {
            const row = document.createElement("div");
            row.className = "result-row";

            const names = document.createElement("span");
            names.className = "result-names";
            names.textContent = `${result.characterA.name} vs ${result.characterB.name}` +
                (result.location ? ` · ${result.location.name}` : " · No location");

            const outcome = document.createElement("span");
            outcome.className = "result-outcome";

            if (result.winner === "attacker") {
                outcome.textContent = `${result.characterA.name} wins`;
                outcome.classList.add("attacker-result");
            } else if (result.winner === "defender") {
                outcome.textContent = `${result.characterB.name} wins`;
                outcome.classList.add("defender-result");
            } else {
                outcome.textContent = state.mode === "tournament"
                    ? "Draw — both characters return to their decks"
                    : "Draw";
                outcome.classList.add("draw-result");
            }

            row.append(names, outcome);

            if (result.closeBattle) {
                const closeLabel = document.createElement("span");
                closeLabel.className = "close-battle-label";
                closeLabel.textContent = "⚡ CLOSE BATTLE!";
                row.appendChild(closeLabel);
            }

            matchupResults.appendChild(row);
        });
    }

    function renderWinnerPopup(state) {
        const results = state.battleResults;
        if (!results || winnerPopupDismissed) {
            winnerPopup.hidden = true;
            return;
        }

        winnerPopup.hidden = false;
        winnerTitle.textContent = results.overallWinner === "draw"
            ? "IT'S A DRAW!"
            : results.overallWinner === "attacker"
                ? "ATTACKERS WIN!"
                : "DEFENDERS WIN!";

        winnerMessage.textContent = state.mode === "tournament"
            ? `${results.reason} Final survivors: ${results.attackerSurvivors} attackers vs ${results.defenderSurvivors} defenders.`
            : `${results.attackerWins} victories for the attackers and ${results.defenderWins} for the defenders.`;
    }

    render();
}
