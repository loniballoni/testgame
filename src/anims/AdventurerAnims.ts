import Phaser from "phaser"

const createAdventurerAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create(
        {
            key: 'adventurer-idle-down',
            frames: anims.generateFrameNumbers('adventurer', { frames: [2] })
        })

    anims.create(
        {
            key: 'adventurer-idle-side',
            frames: anims.generateFrameNumbers('adventurer', { frames: [0] })
        }
    )
    anims.create(
        {
            key: 'adventurer-idle-up',
            frames: anims.generateFrameNumbers('adventurer', { frames: [0] })
        }
    )

    anims.create(
        {
            key: 'adventurer-run-side',
            frames: anims.generateFrameNumbers('adventurer', { start: 13, end: 20 }),
            repeat: -1,
            frameRate: 10,
        }
    )


    anims.create(
        {
            key: 'adventurer-run-down',
            frames: anims.generateFrameNumbers('adventurer', { start: 13, end: 20 }),
            repeat: -1,
            frameRate: 10,
        }
    )


    anims.create(
        {
            key: 'adventurer-run-up',
            frames: anims.generateFrameNumbers('adventurer', { start: 13, end: 20 }),
            repeat: -1,
            frameRate: 10,
        }
    )

    anims.create({
        key: 'adventurer-faint',
        frames: anims.generateFrameNumbers('adventurer', { start: 91, end: 97 }),
        frameRate: 15,
    })

    anims.create({
        key: 'adventurer-swing-sword',
        frames: anims.generateFrameNumbers('adventurer', { start: 27, end: 35 }),
        frameRate: 15,
    })



}

export {
    createAdventurerAnims
}