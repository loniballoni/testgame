import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import GameUI from './scenes/GameUI'
import LevelFinishedScene from './scenes/LevelFinishedScene'

import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth * 0.5,
	height: window.innerHeight * 0.5,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			//debug: true
		}
	},
	plugins: {
		global: [NineSlicePlugin.DefaultCfg]
	},
	scene: [Preloader, Game, GameUI, LevelFinishedScene],
	scale: {
		zoom: 2
	}
})
