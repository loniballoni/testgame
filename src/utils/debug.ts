import Phaser from "phaser"

const debugDraw = (layer: Phaser.Tilemaps.TilemapLayer, scene: Phaser.Scene) => {

    const debugGraphics = scene.add.graphics().setAlpha(0.75)
    layer.renderDebug(debugGraphics, {
        tileColor: null, //color of non colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), //color of colliding tiles
        faceColor: new Phaser.Display.Color(255, 0, 0, 0)
    })
}

export {
    debugDraw
}