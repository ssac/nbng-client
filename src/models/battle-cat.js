import 'phaser';
import _ from 'lodash';

import Cat from './cat';

import {
	MOVE_DURATION_EACH_GRID,
	HP_BAR_HEIGHT
} from '../configs/battle';

const STAT_TO_ICON = [
	{
		stat: 'fire',
		buff: 'icon_buff_fire',
		debuff: 'icon_debuff_fire'
	},
	{
		stat: 'land',
		buff: 'icon_buff_land',
		debuff: 'icon_debuff_land'
	},
	{
		stat: 'wind',
		buff: 'icon_buff_wind',
		debuff: 'icon_debuff_wind'
	},
	{
		stat: 'water',
		buff: 'icon_buff_water',
		debuff: 'icon_debuff_water'
	},
	{
		stat: 'moon',
		buff: 'icon_buff_moon',
		debuff: 'icon_debuff_moon'
	},
];

const STATS = STAT_TO_ICON.map(bundle => bundle.stat);

export default class extends Cat {
	constructor(scene, servData) {
		super(servData);

		this._scene = scene;
		this._servData = servData;

		this._curGrid = [
			servData['grid'][0],
			servData['grid'][1]
		];

		this._avatar = null;
		this._hp = servData.hp;
	}

	preload = () => {
		const id = this.getId();
		this._scene.load.image(id + '', require('../assets/card_icons/' + id + '.png'));
	}

	create = () => {
		const {
			x,
			y,
			grid
		} = this._scene.getMapStat();

		const ctnLen = grid * 0.9;
		const buffIconLen = ctnLen/5;
		const [vert, hori] = this._servData.grid; // Current cat position grid

		const img = this._scene.add.image(
			0, 
			0, 
			this.getId()
		).setDisplaySize(ctnLen, ctnLen);

		

		this._avatar = this._scene.add.container(
			x + hori * grid + grid/2, 
			y + vert * grid + grid/2,
			[img]
		).setSize(ctnLen, ctnLen);
		this._avatar.radius = 10;

		// Add HP bar
		this._hpbar = this._scene.add.rectangle(
			0, 
			(ctnLen - HP_BAR_HEIGHT) / 2, 
			this.getCurHp() / this.getMaxHp() * (this._avatar.width),
			HP_BAR_HEIGHT,
			Phaser.Display.Color.GetColor(3, 252, 82)
		);

		this._avatar.add(this._hpbar);

		// Buff icons
		this._buffIcons = [];
		for(let i = 0; i < STAT_TO_ICON.length; i++) {
			const bundle = STAT_TO_ICON[i];

			const gameObj = this._scene.add.image(
				buffIconLen * i - ctnLen/2 + buffIconLen/2,
				ctnLen/2 - HP_BAR_HEIGHT - buffIconLen/2,
				bundle.buff
			).setDisplaySize(buffIconLen, buffIconLen);

			gameObj.alpha = 0;
			this._buffIcons.push(gameObj);
			this._avatar.add(gameObj)
		}

		// Debuff icons
	}

	update = () => {
		this._hpbar.width = this.getCurHp() / this.getMaxHp() * (this._avatar.width);
		this._scene.update();
	}

	getCurHp = () => {
		return this._hp;
	}

	changeHp = (v) => {
		this._hp += v;

		if (v > 0) {
			this._hp = Math.min(this._hp, this.getMaxHp())
		} else {
			this._hp = Math.max(this._hp, 0);
		}

		this.update();
	}

	getMaxHp = () => {
		return this._servData.max_hp;
	}

	getMyCurPos = () => {
		return this._scene.getPosByGrid(this.getCurGrid());
	}

	getId = () => {
		return this._servData.id + '';
	}

	getImageKey = () => {
		return this.getId();
	}

	move = async (grid) => {
		await this.moveVertical(grid);
		await this.moveHorizontal(grid);
	}

	moveVertical = (toGrid) => {
		return new Promise((resolve) => {
			const [toGridVert, toGridHori] = toGrid;
			const [curGridVert, curGridHori] = this.getCurGrid();
			const py = this._scene.getPosByGrid(toGrid)[1];

			this._scene.tweens.add({
				targets: this._avatar,
				y: py,
				ease: 'Linear',
				delay: 0,
				duration: MOVE_DURATION_EACH_GRID * Math.abs(toGridVert - curGridVert),
				completeDelay: 0,
				onComplete: () => {
					this.setGridVert(toGridVert);
					resolve();
				},
				callbackScope: this._scene
			})
		})
	}

	moveHorizontal = (toGrid) => {
		return new Promise((resolve) => {
			const [toGridVert, toGridHori] = toGrid;
			const [curGridVert, curGridHori] = this.getCurGrid();
			const px = this._scene.getPosByGrid(toGrid)[0];

			this._scene.tweens.add({
				targets: this._avatar,
				x: px,
				ease: 'Linear',
				delay: 0,
				duration: MOVE_DURATION_EACH_GRID * Math.abs(toGridHori - curGridHori),
				completeDelay: 0,
				onComplete: () => {
					this.setGridHori(toGridHori);
					resolve();
				},
				callbackScope: this._scene
			});
		})
	}

	getCurGrid = () => {
		return this._curGrid;
	}

	setGridHori = (gridHori) => {
		this._curGrid[1] = gridHori;
	}

	setGridVert = (gridVert) => {
		this._curGrid[0] = gridVert;
	}

	// Display attack animation
	attack = (targetBattleCat, isCounter) => {
		return new Promise((resolve) => {
			let opt;
			const curGrid = this.getCurGrid();
			const [curGV, curGH] = curGrid;
			const [tarGV, tarGH] = targetBattleCat.getCurGrid();
			const sameLine = curGV === tarGV;

			const [curPosX, curPosY] = this.getMyCurPos();
			const {grid} = this._scene.getMapStat();

			if (sameLine) {
				opt = curGH > tarGH ? {x: curPosX + grid/2} : {x: curPosX - grid/2}
			} else {
				opt = curGV > tarGV ? {y: curPosY - grid/2} : {y: curPosY + grid/2}
			}

			// Move backward and attack forward
			this._scene.tweens.add(Object.assign({}, opt, {
				targets: this._avatar,
				duration: 50,
				ease: "Power2",
				yoyo: true,
				loop: 0,
				onComplete: resolve,
			}));
		})
	}

	// Display hurt animation
	hurt = (dmg) => {
		return new Promise((resolve) => {
			// Shake the avatar
			this._scene.cameras.main.shake(300, 0.005, true);

			// Update HP
			this.changeHp(-1 * dmg);

			// Display damage
			const txt = this._scene.add.text(
				this._avatar.x,
				this._avatar.y - 20,
				dmg,
				{
					fontSize: '20px', 
					fill: '#fc0f03',
					strokeThickness: 5,
					stroke: '#fff'
				}
			).setOrigin(0.5);

			this._scene.tweens.add({
				targets: txt,
				y: this._avatar.y - 40,
				duration: 1200,
				alpha: { from: 1, to: 0 },
				ease: "Back.easeIn",
				onComplete: () => {
					txt.destroy();
					resolve();
				}
			});
		})
	}

	heal = (amount) => {
		return new Promise((resolve) => {
			// Update HP
			this.changeHp(amount);

			// Display damage
			const txt = this._scene.add.text(
				this._avatar.x,
				this._avatar.y - 20,
				amount,
				{
					fontSize: '20px', 
					fill: '#42ed7e',
					strokeThickness: 5,
					stroke: '#fff'
				}
			).setOrigin(0.5);

			this._scene.tweens.add({
				targets: txt,
				y: this._avatar.y - 40,
				duration: 800,
				alpha: { from: 1, to: 0 },
				ease: "Back.easeIn",
				onComplete: () => {
					txt.destroy();
					resolve();
				}
			});
		})
	}

	focus = () => {
		return new Promise((resolve) => {
			// Draw a retangle around avatar
			const rect = this._scene.add.rectangle(
				this._avatar.x, 
				this._avatar.y, 
				this._avatar.width + 20,
				this._avatar.height + 20
			);

			rect.setStrokeStyle(5, Phaser.Display.Color.GetColor(252, 186, 3), 0.8);

			// 
			this._scene.tweens.add({
				targets: rect,
				scale: this._avatar.width / (this._avatar.width + 20),
				duration: 400,
				ease: "Linear",
				onComplete: () => {
					rect.destroy();
					resolve();
				}
			});
		})
	}

	dodge = () => {
		return new Promise((resolve) => {
			this._scene.tweens.add({
				targets: this._avatar,
				alpha: { from: 1, to: 0 },
				duration: 200,
				ease: "Power1",
				yoyo: true,
				onComplete: resolve
			});
		})
	}

	counter = async (atkCat) => {
		await this.dodge();
		await this.attack(atkCat, true);
	}

	effect = async (list) => {
		for(const eft of list) {
			const { type } = eft;

			// Break down to single effect
			switch(type) {
				case 'DAMAGE': {
					await this.hurt(eft.value);
					break;
				}

				case 'BUFF/DEBUFF': {
					for(let i = 0; i < STATS.length; i++) {
						const prop = STATS[i]; // 'fire', 'land', etc
						if (!_.has(eft, prop)) { continue; }

						switch(eft[prop]) {
							case 0:
								await this.removeBuff(prop, i);
								break;
							case 1:
								const iconObj = this.getBuffIconByIndex(i);
								// iconObj.visible = true;
								await this.playBuff(iconObj);
								iconObj.alpha = 1;
								break;
							case 2:
								await this.addDebuff(prop, i);
								break;
						}

						this._scene.update();
					}

					break;
				}

				case 'HEAL': {
					await this.heal(eft.value);
					break;
				}

				case 'STATUS': {
					break;
				}

				case 'ANGER': {
					break;
				}

				case 'HIDE': {
					break;
				}

				case 'TAUNT': {
					break;
				}
			}
		}
	}

	getBuffIconByIndex = (index) => {
		return this._buffIcons[index];
	}

	playBuff = (gameObj) => {
		return new Promise((resolve) => {
			this._scene.tweens.add({
				targets: gameObj,
				alpha: { from: 0, to: 1 },
				y: '-=5',
				yoyo: true,
				duration: 300,
				ease: "Power1",
				repeat: 1,
				onComplete: resolve
			});
		})
	}
}