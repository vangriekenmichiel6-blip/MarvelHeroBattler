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
