import { Character } from "./character.js";


export const characters = [

    new Character({
        id: "doctor-strange",
        name: "Doctor Strange",
        imageURL: "https://borg.com/wp-content/uploads/2016/04/doctor-strange-poster.jpg",
        hero: true,
        stats: {
            attackSpeed: 3, strength: 3, armorPiercing: 4,
            combatSkill: 4, sorcery: 10, weapons: 5,
            range: 5, speed: 3, armor: 2, agility: 3,
            shield: 9, flying: 6, intelligence: 7
        }
    }),

    new Character({
        id: "rocket-raccoon",
        name: "Rocket Raccoon",
        imageURL: "https://moviepostermexico.com/cdn/shop/files/guardians_of_the_galaxy_vol_three_ver9_xxlg_1024x1024%402x.jpg?v=1689834499",
        hero: true,
        stats: {
            attackSpeed: 7, strength: 2, armorPiercing: 2,
            combatSkill: 5, sorcery: 1, weapons: 7,
            range: 7, speed: 5, armor: 1, agility: 6,
            shield: 1, flying: 4, intelligence: 9
        }
    }),

    new Character({
        id: "iron-man",
        name: "Iron Man",
        imageURL: "https://hips.hearstapps.com/digitalspyuk.cdnds.net/15/09/movies-avengers-iron-man-poster.jpg",
        hero: true,
        stats: {
            attackSpeed: 6, strength: 6, armorPiercing: 4,
            combatSkill: 4, sorcery: 1, weapons: 7,
            range: 8, speed: 7, armor: 6, agility: 4,
            shield: 6, flying: 8, intelligence: 9
        }
    }),

    new Character({
        id: "thor",
        name: "Thor",
        imageURL: "https://lumiere-a.akamaihd.net/v1/images/p_thorragnarok_19888_57cddf58.jpeg",
        hero: true,
        stats: {
            attackSpeed: 5, strength: 8, armorPiercing: 6,
            combatSkill: 6, sorcery: 7, weapons: 9,
            range: 7, speed: 7, armor: 5, agility: 3,
            shield: 2, flying: 4, intelligence: 5
        }
    }),

    new Character({
        id: "scarlet-witch",
        name: "Scarlet Witch",
        imageURL: "https://d1uzk9o9cg136f.cloudfront.net/f/16783149/rc/2019/01/12/3a48b4540cd045d3870b973d16c5b87c1888453c_xlarge.jpg",
        hero: true,
        stats: {
            attackSpeed: 6, strength: 2, armorPiercing: 8,
            combatSkill: 3, sorcery: 10, weapons: 1,
            range: 4, speed: 4, armor: 2, agility: 3,
            shield: 4, flying: 5, intelligence: 5
        }
    }),

    new Character({
        id: "punisher",
        name: "The Punisher",
        imageURL: "https://images.thedirect.com/media/photos/pun6.jpg",
        hero: true,
        stats: {
            attackSpeed: 6, strength: 4, armorPiercing: 2,
            combatSkill: 9, sorcery: 1, weapons: 3,
            range: 7, speed: 4, armor: 3, agility: 4,
            shield: 2, flying: 1, intelligence: 4
        }
    }),

    new Character({
        id: "yelena-belova",
        name: "Yelena Belova",
        imageURL: "https://i0.wp.com/thefutureoftheforce.com/wp-content/uploads/2025/04/Marvel-Studios-Thunderbolts-Yelena-Belova-Character-Poster.jpg?resize=640%2C800&ssl=1",
        hero: true,
        stats: {
            attackSpeed: 4, strength: 3, armorPiercing: 2,
            combatSkill: 8, sorcery: 1, weapons: 2,
            range: 2, speed: 4, armor: 3, agility: 5,
            shield: 2, flying: 1, intelligence: 4
        }
    }),

    new Character({
        id: "shang-chi",
        name: "Shang-Chi",
        imageURL: "https://s.yimg.com/lo/mysterio/api/a5dfb2fd4d415615e13bb8014efe14c775e6816f29a4e10a5990c14a99d819b7/lightyear_networkapi/resizefill_w960%3Bquality_80%3Bformat_webp/https%3A%2F%2Fmedia.zenfs.com%2Fen%2Fpeople_218%2Fe65de35dd7abda7b5d97a9eac795ab19",
        hero: true,
        stats: {
            attackSpeed: 7, strength: 4, armorPiercing: 3,
            combatSkill: 10, sorcery: 6, weapons: 8,
            range: 4, speed: 4, armor: 5, agility: 5,
            shield: 3, flying: 3, intelligence: 5
        }
    }),

    new Character({
        id: "hulk",
        name: "Hulk",
        imageURL: "https://akns-images.eonline.com/eol_images/Entire_Site/201834/rs_634x939-180404133027-634-mark-ruffalo-avengers-infinity-war-poster-040418.jpg?crop=776%3A1150%3Bcenter%2Ctop&fit=around%7C776%3A1150&output-quality=90",
        hero: true,
        stats: {
            attackSpeed: 2, strength: 10, armorPiercing: 5,
            combatSkill: 4, sorcery: 1, weapons: 2,
            range: 3, speed: 7, armor: 10, agility: 2,
            shield: 10, flying: 3, intelligence: 2
        }
    }),

    new Character({
        id: "captain-america",
        name: "Captain America",
        imageURL: "https://moviepostermexico.com/cdn/shop/products/captain_america_the_first_avenger_ver2_xxlg_1024x1024%402x.jpg?v=1585241846",
        hero: true,
        stats: {
            attackSpeed: 4, strength: 7, armorPiercing: 2,
            combatSkill: 6, sorcery: 1, weapons: 4,
            range: 4, speed: 6, armor: 3, agility: 4,
            shield: 8, flying: 2, intelligence: 5
        }
    }),

    new Character({
        id: "loki",
        name: "Loki",
        imageURL: "https://artofthemovies.co.uk/cdn/shop/files/IMG_5153.jpg?v=1704398543&width=1200",
        hero: true,
        stats: {
            attackSpeed: 6, strength: 4, armorPiercing: 5,
            combatSkill: 3, sorcery: 9, weapons: 4,
            range: 5, speed: 3, armor: 3, agility: 4,
            shield: 3, flying: 1, intelligence: 6
        }
    }),

    new Character({
        id: "spider-man",
        name: "Spider-Man",
        imageURL: "https://img.3dmgame.com/uploads/images/news/20190522/1558534865_453626.jpg",
        hero: true,
        stats: {
            attackSpeed: 8, strength: 6, armorPiercing: 2,
            combatSkill: 6, sorcery: 1, weapons: 5,
            range: 4, speed: 6, armor: 2, agility: 8,
            shield: 3, flying: 4, intelligence: 7
        }
    }),

    new Character({
        id: "vision",
        name: "Vision",
        imageURL: "https://gcp-na-images.contentstack.com/v3/assets/bltea6093859af6183b/blt276c92ef0c143301/6987ea610b72e359e66e1658/avengers-poster-11.jpg?branch=production",
        hero: true,
        stats: {
            attackSpeed: 5, strength: 7, armorPiercing: 6,
            combatSkill: 3, sorcery: 3, weapons: 7,
            range: 9, speed: 8, armor: 7, agility: 5,
            shield: 3, flying: 8, intelligence: 8
        }
    }),

    new Character({
        id: "black-panther",
        name: "Black Panther",
        imageURL: "https://ro69-bucket.s3.ap-northeast-1.amazonaws.com/uploads/text_image/image/345319/text_image.jpgdefault/resize_image.jpg",
        hero: true,
        stats: {
            attackSpeed: 7, strength: 5, armorPiercing: 2,
            combatSkill: 6, sorcery: 2, weapons: 2,
            range: 1, speed: 7, armor: 8, agility: 5,
            shield: 4, flying: 1, intelligence: 5
        }
    }),

    new Character({
        id: "groot",
        name: "Groot",
        imageURL: "https://cdn.marvel.com/content/1x/hc_characterseries_groot_v3_lg.webp",
        hero: true,
        stats: {
            attackSpeed: 4, strength: 6, armorPiercing: 3,
            combatSkill: 3, sorcery: 1, weapons: 4,
            range: 5, speed: 3, armor: 9, agility: 2,
            shield: 5, flying: 2, intelligence: 3
        }
    }),

    new Character({
        id: "wolverine",
        name: "Wolverine",
        imageURL: "https://i.guim.co.uk/img/media/057e9ea540a1be1dc01486136c15ce20593f1f89/143_0_2500_2000/master/2500.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=82c7471fdc90da79249824f71dc4aed9",
        hero: true,
        stats: {
            attackSpeed: 6, strength: 5, armorPiercing: 7,
            combatSkill: 6, sorcery: 1, weapons: 5,
            range: 1, speed: 5, armor: 8, agility: 4,
            shield: 3, flying: 1, intelligence: 4
        }
    }),

    new Character({
        id: "black-widow",
        name: "Black Widow",
        imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7LFfuBU6qZ41QZQYhQQk9Pon5zzScc7FZ81aJ6oTeeRSSAIrHionUefd9&s=10",
        hero: true,
        stats: {
            attackSpeed: 4, strength: 3, armorPiercing: 2,
            combatSkill: 8, sorcery: 1, weapons: 3,
            range: 2, speed: 4, armor: 3, agility: 5,
            shield: 2, flying: 1, intelligence: 5
        }
    }),

    new Character({
        id: "falcon",
        name: "Falcon",
        imageURL: "https://wallpapercrafter.com/th8003/903927-Falcon-Anthony-Mackie-5K-Sam-Wilson-Avengers-Infinity.jpg",
        hero: true,
        stats: {
            attackSpeed: 5, strength: 3, armorPiercing: 2,
            combatSkill: 5, sorcery: 1, weapons: 4,
            range: 7, speed: 7, armor: 3, agility: 5,
            shield: 7, flying: 7, intelligence: 5
        }
    }),

    new Character({
        id: "magneto",
        name: "Magneto",
        imageURL: "https://filmfare.wwmindia.com/content/2025/mar/ian-mckellen-as-magneto.jpg",
        hero: true,
        stats: {
            attackSpeed: 3, strength: 2, armorPiercing: 6,
            combatSkill: 3, sorcery: 8, weapons: 1,
            range: 6, speed: 3, armor: 3, agility: 3,
            shield: 5, flying: 5, intelligence: 6
        }
    }),

    new Character({
        id: "hawkeye",
        name: "Hawkeye",
        imageURL: "https://vignette.wikia.nocookie.net/marvelmovies/images/c/c4/Hawkeye_AOU_Poster.jpg/revision/latest/scale-to-width-down/2000?cb=20160706191824",
        hero: true,
        stats: {
            attackSpeed: 5, strength: 3, armorPiercing: 3,
            combatSkill: 7, sorcery: 1, weapons: 6,
            range: 8, speed: 4, armor: 3, agility: 4,
            shield: 1, flying: 1, intelligence: 4
        }
    }),

    new Character({
        id: "ant-man",
        name: "Ant-Man",
        imageURL: "https://image.tmdb.org/t/p/original/ldbZrlnnguZNbhS3bCgCLaDYsLo.jpg",
        hero: true,
        stats: {
            attackSpeed: 3, strength: 4, armorPiercing: 4,
            combatSkill: 2, sorcery: 1, weapons: 2,
            range: 1, speed: 4, armor: 4, agility: 8,
            shield: 2, flying: 3, intelligence: 3
        }
    })

];
