# Marvel Hero Battler

## Run
Open `index.html` through a local web server (for example, VS Code Live Server). The app uses JavaScript modules and fetches `data/characters.csv`, so opening it directly as a `file://` URL may not work.

## Game modes
- **5v5**: the original five-matchup mode.
- **Tournament**: each side starts with 15 randomly selected characters, using the same battle calculations and animation as 5v5.

## Tournament rules
- The board has five lanes.
- Players alternate drawing and placing a character into an empty position on their own side.
- When both sides occupy the same lane, they fight.
- The winner stays on the board and the loser is removed.
- A draw returns both characters to their respective shuffled decks.
- A player is eliminated when they have no surviving characters and no cards left to draw.
- When neither side can make another placement, or both decks are exhausted, the number of surviving characters decides the winner. Equal survivor counts produce a draw.

## Adding characters
Add characters to `data/characters.csv` using the existing semicolon-separated format. No JavaScript changes are needed for ordinary character additions.


## Faction selection

After selecting 5v5 or Tournament, choose a faction setup:
- `Heroes vs Villains`: `Hero=yes` characters are assigned to attackers and `Hero=no` characters to defenders.
- `Heroes Only` / `Villains Only`: both teams are drawn from the selected faction.
- `Mixed Teams`: both teams are drawn from the full character list.

The `Hero` column in `data/characters.csv` is the source of truth. Use `yes` for heroes and `no` for villains. 5v5 needs at least 5 characters per side; Tournament needs at least 15 per side.

## Locations

`locations.js` contains the Marvel locations, their image URLs, descriptions, and stat effects. Each matchup has a 60% chance of receiving a location. A location is selected at most once per game; unused pairs show "NO LOCATION".

Supported location effect groups:
- `set`: replace a stat with an exact value (for example `sorcery: 0`).
- `max`: impose an upper limit (for example `flying: 2`).
- `add`: add to a stat.
- `multiply`: multiply a stat.

Example:

```js
effects: {
    set: { sorcery: 0 },
    max: { flying: 2 },
    add: { armor: 1 }
}
```

Location effects are applied to temporary stat copies for battle calculations. The character objects and CSV values are not modified. Add or remove locations in the `LOCATIONS` array; the game automatically prevents duplicates within a match.
