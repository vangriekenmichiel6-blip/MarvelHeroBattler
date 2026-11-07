// ==========================================
// BATTLE POWER CALCULATIONS
// ==========================================

// All calculations are directional: attacker attacks defender.
// The same function is called again with the characters reversed.

function logarithmicScale(value, minValue, maxValue, outputMin, outputMax) {
    return outputMin +
        (outputMax - outputMin) *
        (Math.log10(value) - Math.log10(minValue)) /
        (Math.log10(maxValue) - Math.log10(minValue));
}

export function calculateAttackPower(attacker, defender) {
    const a = attacker.stats;
    const d = defender.stats;

    // 1. Sorcery and weapons
    const sorceryWeapons = 2 * a.sorcery + a.weapons / 2;

    // 2. Range against the opponent's flight.
    // Range / Flying is between 0.1 and 10 for stats from 1 to 10.
    const rangeFlightRatio = a.range / d.flying;
    const rangeFlightScore =
        1 + 14 * (rangeFlightRatio - 0.1) / (10 - 0.1);

    // 3. Combat effectiveness against the opponent's defences.
    // With stats from 1 to 10, this ratio ranges from 0.0001 to 10,000.
    const combatRatio =
        (a.attackSpeed * a.strength * a.combatSkill * a.armorPiercing) /
        (d.speed * d.armor * d.agility * d.shield);

    const combatScore = logarithmicScale(
        combatRatio,
        0.0001,
        10000,
        1,
        10
    );

    // 4. Combined base power.
    const basePower =
        sorceryWeapons +
        rangeFlightScore +
        combatScore;

    // 5. Intelligence advantage.
    const intelligenceRatio = a.intelligence / d.intelligence;
    const adjustedPower = basePower * Math.pow(intelligenceRatio, 0.1);

    // 6. Final logarithmic scale: 1–50.
    // The theoretical adjusted-power interval is 0.1–500.
    const finalPower = logarithmicScale(
        adjustedPower,
        0.1,
        500,
        1,
        50
    );

    return {
        attacker: attacker.name,
        defender: defender.name,
        sorceryWeapons,
        rangeFlightRatio,
        rangeFlightScore,
        combatRatio,
        combatScore,
        basePower,
        intelligenceRatio,
        adjustedPower,
        power: finalPower
    };
}

export function calculateMatchup(characterA, characterB, index) {
    const attackA = calculateAttackPower(characterA, characterB);
    const attackB = calculateAttackPower(characterB, characterA);

    let winner = null;

    if (attackA.power > attackB.power) {
        winner = "attacker";
    } else if (attackB.power > attackA.power) {
        winner = "defender";
    }

    return {
        index,
        characterA,
        characterB,
        attackA,
        attackB,
        winner
    };
}

export function calculateBattles(attackers, defenders) {
    if (attackers.length !== 5 || defenders.length !== 5 ||
        attackers.some(character => character === null) ||
        defenders.some(character => character === null)) {
        throw new Error("All five characters on both sides must be placed before battles can be calculated.");
    }

    const results = attackers.map((attacker, index) =>
        calculateMatchup(attacker, defenders[index], index)
    );

    const attackerWins = results.filter(result => result.winner === "attacker").length;
    const defenderWins = results.filter(result => result.winner === "defender").length;
    const draws = results.filter(result => result.winner === null).length;

    const overallWinner =
        attackerWins > defenderWins ? "attacker" :
        defenderWins > attackerWins ? "defender" :
        "draw";

    // Scores are deliberately only logged to the developer console.
    console.group("MARVEL BATTLE — POWER DEBUG");
    console.table(results.map(result => ({
        matchup: result.index + 1,
        attacker: result.characterA.name,
        defender: result.characterB.name,
        attackerPower: Number(result.attackA.power.toFixed(4)),
        defenderPower: Number(result.attackB.power.toFixed(4)),
        winner: result.winner ?? "Draw"
    })));

    for (const result of results) {
        console.group(`Matchup ${result.index + 1}: ${result.characterA.name} vs ${result.characterB.name}`);
        console.log("Attack A → B:", result.attackA);
        console.log("Attack B → A:", result.attackB);
        console.groupEnd();
    }

    console.log("Final tally:", {
        attackers: attackerWins,
        defenders: defenderWins,
        draws,
        overallWinner
    });
    console.groupEnd();

    return {
        matchups: results,
        attackerWins,
        defenderWins,
        draws,
        overallWinner
    };
}
