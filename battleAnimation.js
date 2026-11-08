
export async function animateBattle(
    result,
    token,
    getAnimationToken,
    elements
) {
    const {
        battleBar,
        battleStatus,
        continueBattleButton
    } = elements;

    // ======================================
    // WIN PROBABILITIES
    // ======================================

    const attackerChance = Math.max(
        0,
        Math.min(1, result.attackerWinChance)
    );

    const defenderChance = Math.max(
        0,
        Math.min(1, result.defenderWinChance)
    );

    const underdogChance = Math.min(
        attackerChance,
        defenderChance
    );

    // 0 = extremely one-sided, 1 = perfectly equal.
    const competitiveness = underdogChance / 0.5;

    const isDraw = result.winner === null;

    // ======================================
    // DETERMINE WINNER
    // ======================================

    const expectedWinner =
        attackerChance >= defenderChance
            ? "attacker"
            : "defender";

    // A character with absolutely no chance
    // cannot win the battle.
    const actualWinner =
        attackerChance === 0
            ? "defender"
            : defenderChance === 0
                ? "attacker"
                : result.winner;

    const winnerDirection =
        actualWinner === "attacker" ? 1 : -1;

    const expectedDirection =
        expectedWinner === "attacker" ? 1 : -1;

    const isUpset =
        !isDraw &&
        actualWinner !== expectedWinner;

    // ======================================
    // MOVEMENT SETTINGS
    // ======================================

    const random = (min, max) =>
        min + Math.random() * (max - min);

    const clamp = (value, min, max) =>
        Math.max(min, Math.min(max, value));

    // Check whether this animation is still active.
    const isCurrent = () =>
        token === getAnimationToken();

    // ======================================
    // MOVEMENT HELPER
    // ======================================

    async function pushTo(position, duration, easing) {

        if (!isCurrent()) return false;

        position = clamp(position, 0, 100);

        battleBar.style.transition =
            `width ${duration}ms ${easing}`;

        battleBar.style.width = `${position}%`;

        await wait(duration);

        return isCurrent();
    }

    // ======================================
    // INITIAL POSITION
    // ======================================

    battleBar.style.transition = "none";
    battleBar.style.width = "50%";

    if (!isCurrent()) return;

    await wait(250);

    if (!isCurrent()) return;

    // ======================================
    // INSTANT VICTORY
    // ======================================

    if (!isDraw &&
        (attackerChance === 0 || defenderChance === 0)) {

        battleBar.style.transition = "none";

        battleBar.style.width =
            actualWinner === "attacker" ? "100%" : "0%";

    // ======================================
    // DRAW
    // ======================================

    } else if (isDraw) {

        const swings = Math.round(
            random(3, 5)
        );

        for (let i = 0; i < swings; i++) {

            const direction =
                i % 2 === 0 ? -1 : 1;

            const progress = i / swings;

            const amplitude =
                random(20, 32) * (1 - progress * 0.35);

            const position =
                50 + direction * amplitude;

            if (!await pushTo(
                position,
                random(650, 1100),
                "cubic-bezier(0.4, 0, 0.2, 1)"
            )) return;
        }

        // Both characters run out of momentum.
        if (!await pushTo(
            50,
            1100,
            "cubic-bezier(0.22, 1, 0.36, 1)"
        )) return;

    // ======================================
    // UPSET: UNDERDOG COMEBACK
    // ======================================

    } else if (isUpset) {

        // The favourite initially dominates.
        // A less likely underdog gets pushed
        // closer to defeat.

        const dominancePosition =
            50 + expectedDirection * (
                32 + (1 - competitiveness) * 10
            );

        const dominanceDuration =
            random(850, 1150) +
            (1 - competitiveness) * 250;

        if (!await pushTo(
            dominancePosition,
            dominanceDuration,
            "cubic-bezier(0.15, 0.8, 0.2, 1)"
        )) return;

        await wait(350);

        if (!isCurrent()) return;

        // The underdog slowly starts fighting back.
        // Each push becomes stronger and faster.

        const comebackStages = [
            {
                progress: 12,
                duration: 1150,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)"
            },
            {
                progress: 32,
                duration: 1000,
                easing: "cubic-bezier(0.3, 0, 0.2, 1)"
            },
            {
                progress: 62,
                duration: 850,
                easing: "cubic-bezier(0.15, 0.8, 0.2, 1)"
            },
            {
                progress: 100,
                duration: 750,
                easing: "cubic-bezier(0.15, 0.8, 0.2, 1)"
            }
        ];

        for (const stage of comebackStages) {

            const position =
                50 + winnerDirection * (
                    stage.progress * 0.5
                );

            if (!await pushTo(
                position,
                stage.duration,
                stage.easing
            )) return;
        }

    // ======================================
    // NORMAL VICTORY
    // ======================================

    } else {

        // How many exchanges should the battle have?
        // Closer battles allow more opportunities
        // for the characters to take control.

        let exchanges;

        if (underdogChance < 0.10) {
            exchanges = 0;
        } else if (underdogChance < 0.20) {
            exchanges = 1;
        } else if (underdogChance < 0.35) {
            exchanges = 2;
        } else {
            exchanges = Math.round(random(2, 4));
        }

        // ======================================
        // OPENING DOMINANCE
        // ======================================

        // The favourite is more likely to establish
        // dominance, but this is not guaranteed.

        const winnerStartsStrong =
            Math.random() <
            0.65 + (0.5 - underdogChance) * 0.5;

        const openingDirection =
            winnerStartsStrong
                ? winnerDirection
                : -winnerDirection;

        const openingAmplitude =
            18 + (1 - competitiveness) * 22;

        const openingPosition =
            50 + openingDirection * openingAmplitude;

        const openingDuration =
            random(700, 1050) +
            (1 - competitiveness) * 200;

        if (!await pushTo(
            openingPosition,
            openingDuration,
            "cubic-bezier(0.15, 0.8, 0.2, 1)"
        )) return;

        await wait(random(100, 250));

        if (!isCurrent()) return;

        // ======================================
        // PUSH AND PULL
        // ======================================

        for (let i = 0; i < exchanges; i++) {

            const progress =
                i / Math.max(exchanges, 1);

            // The underdog gets weaker as the
            // battle becomes more one-sided.

            const loserAmplitude =
                (9 + competitiveness * 17) *
                random(0.85, 1.15) *
                (1 - progress * 0.2);

            const winnerAmplitude =
                loserAmplitude *
                random(1.05, 1.3);

            // The loser attempts to take control.
            // Their pushes are slower and less decisive.

            const loserPosition =
                50 - winnerDirection * loserAmplitude;

            if (!await pushTo(
                loserPosition,
                random(850, 1250) +
                    (1 - competitiveness) * 250,
                "cubic-bezier(0.4, 0, 0.6, 1)"
            )) return;

            await wait(random(100, 250));

            if (!isCurrent()) return;

            // The eventual winner pushes back harder.

            const winnerPosition =
                50 + winnerDirection * winnerAmplitude;

            if (!await pushTo(
                winnerPosition,
                random(550, 900),
                "cubic-bezier(0.15, 0.8, 0.2, 1)"
            )) return;

            await wait(random(100, 250));

            if (!isCurrent()) return;
        }

        // ======================================
        // FINAL VICTORY
        // ======================================

        if (underdogChance < 0.20) {

            // Clear favourites finish decisively.

            if (!await pushTo(
                winnerDirection === 1 ? 100 : 0,
                random(500, 750),
                "cubic-bezier(0.15, 0.8, 0.2, 1)"
            )) return;

        } else {

            // More competitive battles have a
            // gradual final push.

            const finalStages = [
                50 + winnerDirection * 27.5,
                50 + winnerDirection * 37.5,
                winnerDirection === 1 ? 100 : 0
            ];

            for (let i = 0; i < finalStages.length; i++) {

                if (!await pushTo(
                    finalStages[i],
                    random(650, 950),
                    "cubic-bezier(0.15, 0.8, 0.2, 1)"
                )) return;
            }
        }
    }

    // ======================================
    // REVEAL RESULT
    // ======================================

    if (!isCurrent()) return;

    if (isDraw) {

        battleStatus.textContent = "IT'S A DRAW!";

    } else if (result.againstAllOdds && isUpset) {

        battleStatus.textContent = "AGAINST ALL ODDS!";

    } else if (result.closeBattle) {

        battleStatus.textContent = "⚡ CLOSE BATTLE!";

    } else {

        battleStatus.textContent =
            actualWinner === "attacker"
                ? "ATTACKER WINS!"
                : "DEFENDER WINS!";
    }

    continueBattleButton.hidden = false;
}

function wait(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
