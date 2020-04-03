import Phaser from "phaser";

import SceneHome from './scenes/home';
import SceneBattle from './scenes/battle.js';

import {
	WIDTH as DEFAULT_WIDTH,
	HEIGHT as DEFAULT_HEIGHT
} from './configs/game';


const config = {
	type: Phaser.AUTO,
	parent: "content",
	// width: DEFAULT_WIDTH,
	// height: DEFAULT_HEIGHT,

	width: window.innerWidth,
	height: window.innerHeight,

	scale: {
		mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},

	backgroundColor: '#ffe',
	scene: [
		SceneHome,
		SceneBattle
	]
};

const game = new Phaser.Game(config);