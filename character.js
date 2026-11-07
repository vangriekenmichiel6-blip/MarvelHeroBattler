
export class Character {

    constructor({
        id,
        name,
        imageURL = null,
        stats = {}
    }) {

        this.id = id;
        this.name = name;
        this.imageURL = imageURL;

        this.stats = {
            strength: stats.strength ?? 0,
            durability: stats.durability ?? 0,
            speed: stats.speed ?? 0,
            intelligence: stats.intelligence ?? 0,
            combat: stats.combat ?? 0
        };

    }

}
