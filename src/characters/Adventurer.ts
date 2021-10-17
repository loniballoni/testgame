import Phaser, { Physics } from "phaser"

import Chest from '../items/Chest'
import Lever from '../items/Lever'
import Game from '../scenes/Game'

//Create new Scene Event Emitter, but too lazy for now
import { sceneEvents } from '../events/EventCenter'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            adventurer(x: number | undefined, y: number | undefined, texture: string, frame?: string | number): Adventurer
        }
    }
}

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD
}


export default class Adventurer extends Phaser.Physics.Arcade.Sprite {
    private healthState = HealthState.IDLE
    private damageTime = 0
    private animTime = 0

    private game = new Game()

    private i = 0
    static coins = 0
    private _knives = 5

    private activeChest?: Chest
    private activeLever?: Lever

    private knives!: Phaser.Physics.Arcade.Group

    private direction!: string

    private _pressedE = false
    get pressedE() {
        return this._pressedE
    }

    private _health = 3
    get health() {
        return this._health
    }


    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {

        super(scene, x, y, texture, frame)

        this.anims.play('adventurer-idle-side')
        this.setScale(1)
    }

    swordSwung() {
        this._pressedE = false
        return
    }


    /* In future we should also include the game object that gave us the damage
    but we'll leave it like this for the moment for simplicitys sake */
    handleDamage(dir: Phaser.Math.Vector2) {
        if (this._health <= 0) {
            return
        }
        // Doesn't let you get accidentally multiple damage points
        // By one lizard hitting you fast multiple times.
        if (this.healthState === HealthState.DAMAGE) {
            return
        }

        --this._health

        if (this._health <= 0) {
            this.healthState = HealthState.DEAD
            this.anims.play('adventurer-faint')
            console.log('whyyyyy')
            this.setVelocity(0, 0)

        }
        else {
            this.setVelocity(dir.x, dir.y)

            this.setTint(0xff0000)

            this.healthState = HealthState.DAMAGE
            this.damageTime = 0

        }
    }




    setChest(chest: Chest) {
        this.activeChest = chest
    }
    setLever(lever: Lever) {
        this.activeLever = lever
    }

    setKnives(knives: Phaser.Physics.Arcade.Group) {
        this.knives = knives
    }

    whichDoor() {
        return this.i
    }

    private throwKnife() {
        if (!this.knives) {
            return
        }

        const knife = this.knives.get(this.x, this.y, 'knive') as Phaser.Physics.Arcade.Image
        if (!knife) {
            return
        }

        const parts = this.anims.currentAnim.key.split('-')
        const direction = parts[2]
        console.log(direction)

        const vec = new Phaser.Math.Vector2(0, 0)
        switch (direction) {
            case 'up':
                vec.y = -1
                break

            case 'down':
                vec.y = 1
                break

            default:
            case 'side':
                if (this.scaleX < 0) {
                    vec.x = -1
                }
                else {
                    vec.x = 1
                }
                break
        }

        const angle = vec.angle()

        knife.setActive(true)
        knife.setVisible(true)

        knife.setRotation(angle)

        knife.x += vec.x * 16
        knife.y += vec.y * 16

        knife.setVelocity(vec.x * 200, vec.y * 200)
    }



    preUpdate(t: number, dt: number) {
        // The logic that the Arcade Sprite does needs to be done on itself.
        // That's only possible with the super.preupdate(t, dt) function.
        super.preUpdate(t, dt)
        switch (this.healthState) {
            case HealthState.IDLE:
                break

            case HealthState.DAMAGE:
                //Here adding dt works as an accumulator to this damageTime property 
                this.damageTime += dt
                if (this.damageTime >= 250) {
                    this.healthState = HealthState.IDLE
                    // Base tint
                    this.setTint(0xffffff)
                    this.damageTime = 0
                }
                break
        }
    }



    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, keyboard: Phaser.Input.Keyboard.KeyboardPlugin) {
        /* Change the movement so it's smoother diagonally */

        if (this.healthState === HealthState.DAMAGE
            || this.healthState === HealthState.DEAD
        ) {
            return
        }

        if (!cursors) {
            return
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
            if (this.activeChest) {
                const coins = this.activeChest.open()
                Adventurer.coins += coins

                sceneEvents.emit('player-coins-changed', Adventurer.coins)
                console.log('hyyyyy')
            }

            else if (this.activeLever) {
                this.i = this.activeLever.activate()
                console.log(this.i)
            }
            else {
                console.log('bruuhh')
                if (this._knives > 0) {
                    this.throwKnife()
                    this._knives--
                }
                sceneEvents.emit('player-knives-changed', this._knives)
            }
        }

        const e = keyboard.addKey('e')
        if (Phaser.Input.Keyboard.JustDown(e)) {
            this.anims.play('adventurer-swing-sword')
            this.animTime = 0

            this._pressedE = true
            console.log(this._pressedE)
        }

        if (this.anims.currentAnim.key === 'adventurer-swing-sword' && this.animTime < 10) {
            this.animTime += 1
            return
        }
        this.animTime = 0

        const speed = 100
        const leftDown = cursors.left.isDown
        const rightDown = cursors.right.isDown
        const upDown = cursors.up.isDown
        const downDown = cursors.down.isDown

        if (leftDown) {
            this.anims.play('adventurer-run-side', true)
            this.setVelocityX(-speed)

            this.scaleX = -1
            this.body.offset.x = 22

        }
        else if (rightDown) {
            this.anims.play('adventurer-run-side', true)
            this.setVelocityX(speed)

            this.scaleX = 1
            this.body.offset.x = 5

        }
        else if (upDown) {
            this.anims.play('adventurer-run-up', true)
            this.setVelocityY(-speed)
            //.setScale(1, 1)
            //this.body.offset.x = 8

        }
        else if (downDown) {
            this.anims.play('adventurer-run-down', true)
            this.setVelocityY(speed)
            //.setScale(1, 1)
            //this.body.offset.x = 8

        }
        else {

            const parts = this.anims.currentAnim.key.split('-')
            parts[1] = 'idle'
            this.anims.play(parts.join('-'))

            this.setVelocity(0, 0)
        }
        this.body.velocity.normalize().scale(speed);

        if (leftDown || rightDown || upDown || downDown) {
            this.activeChest = undefined
            this.activeLever = undefined
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('adventurer', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    var sprite = new Adventurer(this.scene, x, y, 'adventurer', frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.6)
    sprite.body.offset.x = 6
    sprite.body.offset.y = 11

    //this.scene.cameras.main.startFollow(sprite, true)

    return sprite
})