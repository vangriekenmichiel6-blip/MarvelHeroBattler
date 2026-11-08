
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

    let currentBattle = null;
    let animationToken = 0;

    // ==========================================
    // RESET
    // ==========================================

    resetButton.addEventListener("click", () => {

        animationToken++;
        currentBattle = null;

        game.resetGame();

        battlePopup.hidden = true;

        render();
    });

    continueBattleButton.addEventListener("click", () => {

        game.finishBattle();

        currentBattle = null;

        render();
    });

    // ==========================================
    // RENDER EVERYTHING
    // ==========================================

    function render() {

        const state = game.getGameState();

        renderDecks(state);
        renderDrawSection(state);
        renderMatchups(state);
        renderBattleResults(state);
        renderBattlePopup(state);
    }

    // ==========================================
    // DECKS
    // ==========================================

    function renderDecks(state) {

        attackerCount.textContent =
            `${state.attackers.filter(c => c !== null).length} / 5 placed`;

        defenderCount.textContent =
            `${state.defenders.filter(c => c !== null).length} / 5 placed`;
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

            turnText.textContent = "BATTLES COMPLETE!";
            drawStatus.textContent =
                "All five matchups have been calculated.";

            return;
        }

        if (pending === null) return;

        const side = pending.side;
        const character = pending.character;

        turnText.textContent = `${side.toUpperCase()}'S CHARACTER`;

        drawStatus.textContent =
            `Place ${character.name} in an empty ${side} slot.`;

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

            matchupGrid.appendChild(
                createCharacterCard("attacker", i, state)
            );

            matchupGrid.appendChild(
                createCharacterCard("defender", i, state)
            );
        }
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
            `MATCHUP ${result.index + 1}`;

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

        animateBattle(result, token);
    }

    // ==========================================
    // BATTLE ANIMATION
    // ==========================================

    function wait(milliseconds) {

        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    async function animateBattle(result, token) {

        const attackerChance = result.attackerWinChance;
        const defenderChance = result.defenderWinChance;

        const underdogChance = Math.min(
            attackerChance,
            defenderChance
        );

        // Number of swings increases with battle closeness.

        const swings = 2 + Math.round(underdogChance * 14);

        // Close battles take longer to animate.

        const stepDuration =
            180 + underdogChance * 350;

        const isDraw = result.winner === null;

        const target = isDraw
            ? 50
            : result.winner === "attacker"
                ? 100
                : 0;

        // Let the popup appear before the animation.

        await wait(350);

        if (token !== animationToken) return;

        for (let i = 0; i < swings; i++) {

            const progress = (i + 1) / swings;

            // Gradually move towards the final result.

            const base =
                50 + (target - 50) * progress;

            // Add diminishing back-and-forth movement.

            const amplitude =
                isDraw ? 15 * (1 - progress) :
                20 * (1 - progress);

            const direction = i % 2 === 0 ? 1 : -1;

            const movement =
                direction * amplitude;

            let position = base + movement;

            position = Math.max(2, Math.min(98, position));

            if (i === swings - 1) {
                position = target;
            }

            battleBar.style.transition =
                `width ${stepDuration}ms ease-in-out`;

            battleBar.style.width = `${position}%`;

            await wait(stepDuration);

            if (token !== animationToken) return;
        }

        // ======================================
        // REVEAL RESULT
        // ======================================

        if (isDraw) {

            battleStatus.textContent = "IT'S A DRAW!";
            battleStatus.className = "draw-result";

        } else if (result.againstAllOdds) {

            const winnerName =
                result.winner === "attacker"
                    ? result.characterA.name
                    : result.characterB.name;

            battleStatus.textContent =
                `AGAINST ALL ODDS! ${winnerName.toUpperCase()} WINS!`;

            battleStatus.className = "against-odds-result";

        } else {

            const winnerName =
                result.winner === "attacker"
                    ? result.characterA.name
                    : result.characterB.name;

            battleStatus.textContent =
                `${winnerName.toUpperCase()} WINS!`;

            battleStatus.className =
                result.winner === "attacker"
                    ? "attacker-result"
                    : "defender-result";
        }

        continueBattleButton.hidden = false;
    }

    // ==========================================
    // FINAL BATTLE RESULTS
    // ==========================================

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

                outcome.textContent = result.againstAllOdds
                    ? `Against all odds, ${result.characterA.name} won the match!`
                    : `${result.characterA.name} wins`;

                outcome.classList.add(
                    result.againstAllOdds
                        ? "against-odds-result"
                        : "attacker-result"
                );

            } else if (result.winner === "defender") {

                outcome.textContent = result.againstAllOdds
                    ? `Against all odds, ${result.characterB.name} won the match!`
                    : `${result.characterB.name} wins`;

                outcome.classList.add(
                    result.againstAllOdds
                        ? "against-odds-result"
                        : "defender-result"
                );

            } else {

                outcome.textContent = "Draw";
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

        // ======================================
        // OVERALL WINNER
        // ======================================

        if (results.overallWinner === "attacker") {

            battleSummary.textContent =
                `ATTACKERS WIN ${results.attackerWins}–${results.defenderWins}`;

            battleSummary.className =
                "battle-summary attacker-result";

        } else if (results.overallWinner === "defender") {

            battleSummary.textContent =
                `DEFENDERS WIN ${results.defenderWins}–${results.attackerWins}`;

            battleSummary.className =
                "battle-summary defender-result";

        } else {

            battleSummary.textContent =
                `THE BATTLE IS A DRAW ${results.attackerWins}–${results.defenderWins}`;

            battleSummary.className =
                "battle-summary draw-result";
        }

        if (results.draws > 0) {

            battleSummary.textContent +=
                ` (${results.draws} matchup${results.draws === 1 ? "" : "s"} tied)`;
        }
    }

    render();
}
