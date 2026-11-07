export class Character {

    constructor({ id, name, imageURL = null, hero = true, stats = {} }) {

        this.id = id;
        this.name = name;
        this.imageURL = imageURL;
        this.hero = hero;

        this.stats = {

            attackSpeed: stats.attackSpeed ?? 1,
            strength: stats.strength ?? 1,
            armorPiercing: stats.armorPiercing ?? 1,
            combatSkill: stats.combatSkill ?? 1,
            sorcery: stats.sorcery ?? 1,
            weapons: stats.weapons ?? 1,
            range: stats.range ?? 1,
            speed: stats.speed ?? 1,
            armor: stats.armor ?? 1,
            agility: stats.agility ?? 1,
            shield: stats.shield ?? 1,
            flying: stats.flying ?? 1,
            intelligence: stats.intelligence ?? 1

        };
    }
}