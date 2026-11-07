import { Character } from "./character.js";

// Read one semicolon-separated CSV line, including quoted fields.
function parseCSVLine(line) {
    const fields = [];
    let field = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (insideQuotes && line[i + 1] === '"') {
                field += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ";" && !insideQuotes) {
            fields.push(field);
            field = "";
        } else {
            field += char;
        }
    }

    fields.push(field);
    return fields;
}

export async function loadCharacters() {
    const response = await fetch("./data/characters.csv");

    if (!response.ok) {
        throw new Error("Could not load characters.csv");
    }

    const csv = await response.text();

    const lines = csv.trim().split(/\r?\n/);
    const headers = parseCSVLine(lines[0].replace(/^\uFEFF/, ""));

    const characters = lines.slice(1)
        .filter(line => line.trim() !== "")
        .map(line => {
            const values = parseCSVLine(line);

            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index]?.trim() ?? "";
            });

            return new Character({
                id: row.ID,
                name: row.Name,
                imageURL: row.imageUrl,
                hero: row.Hero.toLowerCase() === "yes",

                stats: {
                    attackSpeed: Number(row["Attack Speed"]),
                    strength: Number(row.Strength),
                    armorPiercing: Number(row["Armor Piercing"]),
                    combatSkill: Number(row["Combat Skill"]),
                    sorcery: Number(row.Sorcery),
                    weapons: Number(row.Weapons),
                    range: Number(row.Range),
                    speed: Number(row.Speed),
                    armor: Number(row.Armor),
                    agility: Number(row.Agility),
                    shield: Number(row.Shield),
                    flying: Number(row.Flying),
                    intelligence: Number(row.Intelligence)
                }
            });
        });

    return characters;
}