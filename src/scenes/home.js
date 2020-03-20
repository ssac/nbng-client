import Phaser from "phaser";

import logoImg from "../assets/logo.png";
import BgImg from '../assets/main_bg.jpg';

import TestData from './test-data';

import {
	WIDTH,
	HEIGHT
} from '../configs/game';

const Scene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:

	function Home() {
		Phaser.Scene.call(this, 'home');
	},

	preload: function() {
		this.load.image("logo", logoImg);
		this.load.image("bg", BgImg);

		// this.load.image('cat1', 'src/assets/buildercat_0.png');
		// this.load.image('cat2', 'src/assets/buildercat_1.png');
		// this.load.image('cat3', 'src/assets/buildercat_2.png');

		this.load.image('cat1', require('../assets/buildercat_0.png'));
		this.load.image('cat2', require('../assets/buildercat_1.png'));
		this.load.image('cat3', require('../assets/buildercat_2.png'));
	},

	create: function() {
		const bg = this.add.image(WIDTH/2, HEIGHT/2, "bg").setScale(2);

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
			WIDTH/2, 
			HEIGHT/2 - logoLen - 20, 
			'cat1'
		).play('building');

		const title = this.add.text(
			16, 
			16, 
			'PROTOTYPE', 
			{ fontSize: '32px', fill: '#000', fontStyle: 'italic' }
		);

		const search = this.add.text(
			WIDTH/2,
			HEIGHT - 30,
			'搜索「信喵避風港」',
			{ fontSize: '16px', fill: '#000' }
		).setOrigin(0.5);;

		const start = this.add.text(
			WIDTH/2, 
			HEIGHT/2, 
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
});

export default Scene;