import Phaser from "phaser";

import BgImg from '../assets/main_bg.jpg';
import TestData from './test-data';

import {
	WIDTH,
	HEIGHT
} from '../configs/game';

export default class extends Phaser.Scene {
	constructor() {
		super('home');
	}
	// Extends: Phaser.Scene,

	// initialize: function Home() {
	// 	Phaser.Scene.call(this, 'home');
	// },

	preload () {
		this.load.image("bg", BgImg);
		
		this.load.image('cat1', require('../assets/buildercat_0.png'));
		this.load.image('cat2', require('../assets/buildercat_1.png'));
		this.load.image('cat3', require('../assets/buildercat_2.png'));
	}

	create () {
		const bg = this.add.image(
			this.game.config.width/2, 
			this.game.config.height/2, 
			"bg"
		);
		bg.scale = this.game.config.width / bg.width;

		this.anims.create({
			key: 'building',
			frames: [
				{ key: 'cat1' },
				{ key: 'cat2' },
				{ key: 'cat3', duration: 50 }
			],
			frameRate: 8,
			repeat: -1
		});

		const logoLen = 90;

		this.add.sprite(
			this.game.config.width/2, 
			this.game.config.height/2 - logoLen - 20, 
			'cat1'
		).play('building');

		const title = this.add.text(
			16, 
			16, 
			'PROTOTYPE', 
			{ fontSize: '32px', fill: '#000', fontStyle: 'italic' }
		);

		const search = this.add.text(
			this.game.config.width/2,
			this.game.config.height - 30,
			'搜索「信喵避風港」',
			{ fontSize: '16px', fill: '#000' }
		).setOrigin(0.5);;

		const start = this.add.text(
			this.game.config.width/2, 
			this.game.config.height/2, 
			'CLICK TO START', 
			{ 
				fontSize: '28px', 
				fill: '#000'
			}
		).setOrigin(0.5);

		this.tweens.add({
			targets: start,
			alpha: { from: 1, to: 0 },
			yoyo: true,
			duration: 500,
			ease: "Power1",
			repeat: -1,
		});

		this.input.once('pointerup', function () {
			this.scene.start('battle', TestData);
		}, this);
	}
}