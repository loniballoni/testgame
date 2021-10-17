import Phaser from "phaser"

export default class Lever extends Phaser.Physics.Arcade.Sprite {

    private i = 0

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string | number) {
        super(scene, x, y, texture, frame)

        this.setTexture('leverOff')
    }

    activate() {


        if (this.texture.key !== 'leverOff') {

            return 0
        }
        this.i++

        this.setTexture('leverOn')
        return this.i
    }

}