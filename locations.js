// Marvel locations. Effects are applied to temporary battle-stat copies,
// never to the original character or the CSV data.
export const LOCATIONS = [
    {
        id: "wakanda",
        name: "Wakanda",
        imageURL: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500",
        description: "The advanced nation of Wakanda. Vibranium technology and defensive infrastructure shape the battlefield.",
        effects: { max: { weapons: 8, range: 6 }, add: { armor: 1, shield: 1 } }
    },
    {
        id: "asgard",
        name: "Asgard",
        imageURL: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500",
        description: "The realm of the Asgardians. Its immense scale and mystical atmosphere favour powerful, durable fighters.",
        effects: { add: { strength: 1, armor: 1 }, max: { agility: 7 } }
    },
    {
        id: "knowhere",
        name: "Knowhere",
        imageURL: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500",
        description: "A remote settlement built inside a Celestial's severed head. There is little room for aerial manoeuvres.",
        effects: { max: { flying: 3 } }
    },
    {
        id: "sanctum",
        name: "Sanctum Sanctorum",
        imageURL: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
        description: "A stronghold of the Masters of the Mystic Arts. Sorcery is suppressed within its protected grounds.",
        effects: { set: { sorcery: 0 } }
    },
    {
        id: "titan",
        name: "Titan",
        imageURL: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500",
        description: "The devastated homeworld of Thanos. Its broken terrain makes movement and positioning difficult.",
        effects: { max: { speed: 5, agility: 6 }, add: { strength: 1 } }
    },
    {
        id: "new-york",
        name: "New York",
        imageURL: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=500",
        description: "A dense urban battlefield. Long-range attacks and unrestricted flight are harder to use safely.",
        effects: { max: { range: 6, flying: 5 } }
    },
    {
        id: "quantum-realm",
        name: "Quantum Realm",
        imageURL: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500",
        description: "A strange subatomic dimension where conventional movement and distance become unreliable.",
        effects: { max: { range: 3, speed: 6 }, add: { sorcery: 1 } }
    },
    {
        id: "sakaar",
        name: "Sakaar",
        imageURL: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500",
        description: "A harsh junkyard planet known for its gladiatorial contests. Close-quarters combat is encouraged.",
        effects: { max: { range: 3 }, add: { combatSkill: 1, strength: 1 } }
    }
];

export function createLocationAssignments(pairCount = 5, chance = 0.6) {
    const available = [...LOCATIONS].sort(() => Math.random() - 0.5);
    return Array.from({ length: pairCount }, () =>
        Math.random() < chance && available.length > 0 ? available.pop() : null
    );
}

export function applyLocationToStats(stats, location) {
    const modified = { ...stats };
    if (!location?.effects) return modified;

    const { set = {}, max = {}, add = {}, multiply = {} } = location.effects;
    for (const [key, value] of Object.entries(set)) {
        if (key in modified) modified[key] = value;
    }
    for (const [key, value] of Object.entries(add)) {
        if (key in modified) modified[key] += value;
    }
    for (const [key, value] of Object.entries(multiply)) {
        if (key in modified) modified[key] *= value;
    }
    for (const [key, value] of Object.entries(max)) {
        if (key in modified) modified[key] = Math.min(modified[key], value);
    }
    // Character stats normally use a 1–10 scale; zero is allowed for a
    // stat that a location explicitly removes (for example, sorcery).
    for (const key of Object.keys(modified)) {
        modified[key] = Math.max(0, Math.min(10, modified[key]));
    }
    return modified;
}
