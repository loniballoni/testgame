import Phaser, { GameObjects } from 'phaser'

import { debugDraw } from '../utils/debug'
import { createAdventurerAnims } from '../anims/AdventurerAnims'
import { createChestAnims } from '../anims/TreasureAnims'
import { createLizardAnims } from '../anims/EnemyAnims'

import Lizard from '../enemies/lizard'

import '../characters/Adventurer'
import Adventurer from '../characters/Adventurer'
import Chest from '../items/Chest'
import Lever from '../items/Lever'

import { sceneEvents } from '../events/EventCenter'

export default class Game extends Phaser.Scene {

    private direction!: number

    private closedDoor1Collidor!: Phaser.Physics.Arcade.Collider
    private closedDoor1!: Phaser.Tilemaps.TilemapLayer
    private adventurer!: Adventurer

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private keyboard!: Phaser.Input.Keyboard.KeyboardPlugin

    private playerLizardsCollider!: Phaser.Physics.Arcade.Collider

    private knives!: Phaser.Physics.Arcade.Group

    private lizards!: Phaser.Physics.Arcade.Group

    private swordHitbox!: Phaser.GameObjects.Rectangle

    private countLizards = 0
    private killedLizards = 0

    constructor() {
        super('game')
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.keyboard = this.input.keyboard
    }

    create() {
        this.scene.run('game-ui')
        this.scene.run('adventurer')

        createLizardAnims(this.anims)
        createAdventurerAnims(this.anims)
        createChestAnims(this.anims)

        //map
        const map = this.make.tilemap({ key: 'dungeon-2' })
        const tileset1 = map.addTilesetImage('dungeon2', 'tiles')
        const tileset2 = map.addTilesetImage('dungeon1', 'tiles1')
        const tileset3 = map.addTilesetImage('zelda_like', 'tiles3')

        //ground
        const groundLayer = map.createLayer('Ground', [tileset1, tileset2, tileset3])
        const groundLayer2 = map.createLayer('Ground2', [tileset1, tileset2, tileset3])

        //walls
        const wallsLayer2 = map.createLayer('Walls2', [tileset1, tileset2, tileset3])
        wallsLayer2.setCollisionByProperty({ collides1: true })
        //debugDraw(wallsLayer2, this)

        const wallsLayer = map.createLayer('Walls', [tileset1, tileset2, tileset3])
        wallsLayer.setCollisionByProperty({ collides: true, collides1: true })
        //debugDraw(wallsLayer, this)



        //Door1
        const openDoor1 = map.createLayer('OpenDoor1', [tileset1, tileset2, tileset3])

        this.closedDoor1 = map.createLayer('ClosedDoor1', [tileset1, tileset2, tileset3])
        this.closedDoor1.setCollisionByProperty({ collides1: true })

        //Door1_openend
        const openDoor1Collision = map.createFromObjects('Interactive', {
            name: 'OpenDoor1'
        })

        this.physics.world.enable(openDoor1Collision, 1)

        openDoor1Collision.forEach(obj => {
            obj.body.position.y += obj['displayHeight']
            obj['visible'] = false
        })



        //Chests + test lever
        const chests = this.physics.add.staticGroup({
            classType: Chest
        })
        const levers = this.physics.add.staticGroup({
            classType: Lever
        })

        const chestLayer = map.getObjectLayer('Chests')
        chestLayer.objects.forEach(obj => {
            if (obj.type === 'treasure') {
                chests.get(obj.x! + obj.width! * 0.5, obj.y! - obj.height! * 0.5)
            }

            if (obj.type === 'lever') {
                levers.get(obj.x! + obj.width! * 0.5, obj.y! - obj.height! * 0.5, 'leverOff')
            }
        })


        //player
        const spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point')
        const spawnPoint2 = map.findObject('Objects', obj => obj.name === 'Spawn Point2')
        this.adventurer = this.add.adventurer(spawnPoint.x, spawnPoint.y, 'adventurer')

        //lizards
        /* Creating a lizard group with the class type Phaser.Physics.Arcadee.Sprite */
        this.lizards = this.physics.add.group({
            classType: Lizard,
            createCallback: (go) => {
                const lizGo = go as Lizard
                lizGo.body.onCollide = true
            }
        })

        //Lizards

        const lizardsLayer = map.getObjectLayer('Lizards')
        lizardsLayer.objects.forEach(lizObj => {
            this.lizards.get(lizObj.x! + lizObj.width! * 0.5, lizObj.y! - lizObj.height! * 0.5)
            this.countLizards++
        })

        //const lizard = this.physics.add.sprite(170, 128, 'lizard', 'lizard_m_idle_anim_f0.png')
        /* Instead of that we can now type */
        this.lizards.get(170, 140, 'lizard')


        //knifes
        this.knives = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            //maxSize: 3,
            key: 'knive'
        })
        this.adventurer.setKnives(this.knives)


        /*
                this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
                    sceneEvents.on('swordAttack', (scaleX: number) => {
                        if (scaleX < 0) {
                            this.direction = -10
                        } else {
                            this.direction = 10
                        }
                        this.swordHitbox = this.add.rectangle(this.adventurer.x + this.direction, this.adventurer.y + 5, 15, 15, 0xff0000, 0.5)
                    }, this)
                })
         */
        //collidors
        this.physics.add.collider(this.adventurer, wallsLayer)
        this.physics.add.collider(this.adventurer, wallsLayer2)
        this.playerLizardsCollider = this.physics.add.collider(this.lizards, this.adventurer, this.handlePlayerLizardCollision, undefined, this)
        //Door1
        this.closedDoor1Collidor = this.physics.add.collider(this.adventurer, this.closedDoor1)
        //Door1_opened
        this.physics.add.collider(this.adventurer, openDoor1Collision)
        //Chests + test switch
        this.physics.add.collider(this.adventurer, chests, this.handlePlayerChestCollision, undefined, this)
        this.physics.add.collider(this.adventurer, levers, this.handlePlayerLeverCollision, undefined, this)
        //Lizard + world
        this.physics.add.collider(this.lizards, wallsLayer)
        this.physics.add.collider(this.lizards, wallsLayer2)
        this.physics.add.collider(this.lizards, this.closedDoor1)
        this.physics.add.collider(this.lizards, chests)
        this.physics.add.collider(this.lizards, levers, this.handlePlayerLeverCollision, undefined, this)
        this.physics.add.collider(this.lizards, openDoor1Collision)
        //knive
        this.physics.add.collider(this.knives, wallsLayer, this.handleKnifeWallCollision, undefined, this)
        this.physics.add.collider(this.knives, this.lizards, this.handleKniveLizardCollision, undefined, this)

        //Chest tile but it's teleportation
        const portal1 = map.findObject('Interactive', obj => obj.name === 'Portal1')
        const portalSiluette = this.add.rectangle((portal1.x! + (portal1.width! / 2)), (portal1.y! + (portal1.height! / 2)), portal1.width, portal1.height)
        this.physics.world.enable(portalSiluette, 1)
        this.physics.add.collider(this.adventurer, portalSiluette, () => {
            this.adventurer.setPosition(spawnPoint2.x, spawnPoint2.y)
            this.cameras.main.setBounds(800, 0, 480, 320)
        }, undefined)



        //camera
        this.cameras.main.setZoom(2)
        this.cameras.main.startFollow(this.adventurer, true)
        this.cameras.main.setBounds(0, 0, 640, 480)

    }

    private swordRange() {
        if (this.adventurer.scaleX < 0) {
            this.direction = -10
        } else {
            this.direction = 10
        }
        this.swordHitbox = this.add.rectangle(this.adventurer.x + this.direction, this.adventurer.y + 5, 15, 15 /*,0xff0000, 0.5 */)
        this.physics.world.enable(this.swordHitbox)
        this.physics.add.overlap(this.swordHitbox, this.lizards, this.handleKniveLizardCollision, undefined, this)
        this.adventurer.swordSwung()
        setTimeout(() => {
            this.swordHitbox.destroy()
        }, 500)
    }



    private handleKnifeWallCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        this.knives.killAndHide(obj1)
        obj1.destroy()
    }

    private handleKniveLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        this.knives.killAndHide(obj1)
        this.lizards.killAndHide(obj2)
        obj2.destroy(true)
        this.killedLizards++
    }


    private handlePlayerLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const lizard = obj2 as Lizard

        const dx = this.adventurer.x - lizard.x
        const dy = this.adventurer.y - lizard.y

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100)

        this.adventurer.handleDamage(dir)

        sceneEvents.emit('player-health-changed', this.adventurer.health)

        if (this.adventurer.health <= 0) {
            this.playerLizardsCollider.destroy()
        }
    }



    private handlePlayerChestCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const chest = obj2 as Chest
        this.adventurer.setChest(chest)
    }

    private handlePlayerLeverCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const lever = obj2 as Lever
        this.adventurer.setLever(lever)
    }



    update(t: number, dt: number) {
        if (this.killedLizards > this.countLizards) {
            console.log('lmao')
            this.scene.start('level-finished', {
                coins: Adventurer.coins
            })
        }

        if (this.adventurer) {
            this.adventurer.update(this.cursors, this.keyboard)

        }

        if (this.adventurer.pressedE) {
            this.swordRange()
        }

        //Opening doors
        let i = this.adventurer.whichDoor()
        switch (i) {
            case 1:
                if (this.closedDoor1['visible'] === true) {
                    this.closedDoor1['visible'] = false
                    this.closedDoor1Collidor.destroy()
                }
                break

            default:
                break;
        }

    }
}
