
// ==========================================
// SHUFFLE
// ==========================================

export function shuffle(array) {

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];

    }

    return shuffled;

}


// ==========================================
// RANDOM INTEGER
// ==========================================

// Returns a random integer between min and max,
// including both min and max.

export function randomInt(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}
