import Phaser from 'phaser'

export default class LevelFinishedScene extends Phaser.Scene {
    constructor() {
        super('level-finished')
    }

    create(data: { coins: number } = { coins: 0 }) {

        const width = window.innerWidth * 0.5
        const height = window.innerHeight * 0.5

        this.add.text(width * 0.5, height * 0.5, 'All Enemies defeated!', {
            fontSize: 20
        }).setOrigin(0.5, 0.5)

        this.add.text(width * 0.5, height * 0.6, `You have collected ${data.coins} coins!`, {
            fontsize: 20
        }).setOrigin(0.5, 0.5)
    }
}