import Phaser from "phaser"

import WebFontFile from "../fonts/WebFontFile"

export default class Preloader extends Phaser.Scene {

    constructor() {
        super('preloader')
    }

    preload() {
        this.load.spritesheet('adventurer', 'characters/adventurer.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json')

        this.load.image('leverOff', 'items/leverOff.png')
        this.load.image('leverOn', 'items/leverOn.png')
        this.load.image('tiles', 'tiles/dungeon-2.png')
        this.load.image('tiles1', 'tiles/dungeon-01.png')
        this.load.image('tiles3', 'tiles/Overworld.png')
        this.load.tilemapTiledJSON('dungeon-2', 'tiles/dungeon-2.json')

        this.load.image('ui-heart-full', 'ui/ui_heart_full.png')
        this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png')

        this.load.atlas('lizard', 'enemies/lizard.png', 'enemies/lizard.json')

        this.load.image('knive', 'weapons/knife2.png')
        this.load.image('knive2', 'weapons/knife.png')

        this.load.atlas('coin', 'items/coin.png', 'items/coin.json')

        //Font
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create() {
        this.scene.start('game')
    }
}