import Phaser from "phaser"

import { sceneEvents } from '../events/EventCenter'
import WebFontFile from "../fonts/WebFontFile"


export default class GameUI extends Phaser.Scene {
    private hearts!: Phaser.GameObjects.Group

    constructor() {
        super('game-ui')
    }

    preload() {
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create() {
        this.add.image(16, 47, 'coin', 'coin_anim_f0.png').setScale(3)
        const coinsLabel = this.add.text(30, 40, '0', {
            fontSize: '20px',
            fontFamily: '"Press Start 2p',

        }).setResolution(10)

        sceneEvents.on('player-coins-changed', (coins: number) => {
            coinsLabel.text = coins.toString()
        })
        this.add.image(18, 75, 'knive2').setScale(2)
        const kniveLabel = this.add.text(30, 70, '5', {
            fontSize: '20px',
            fontFamily: '"Press Start 2p"'
        }).setResolution(10)
        sceneEvents.on('player-knives-changed', (knives: number) => {
            kniveLabel.text = knives.toString()
        })

        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        })


        this.hearts.createMultiple({
            key: 'ui-heart-full',
            setXY: {
                x: 20,
                y: 20,
                stepX: 30
            },
            quantity: 3,
        }).forEach(obj => {
            obj.setScale(2)
        })

        sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this)
            sceneEvents.off('player-coins-changed')
            sceneEvents.off('player-knives-changed')
        })
    }

    private handlePlayerHealthChanged(health: number) {
        this.hearts.children.each((go, idx) => {
            const heart = go as Phaser.GameObjects.Image
            if (idx < health) {
                heart.setTexture('ui-heart-full')
            }
            else {
                heart.setTexture('ui-heart-empty')
            }

        })



    }
}
