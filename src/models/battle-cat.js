import 'phaser';
import _ from 'lodash';
import NbngUniverse from 'nbng-universe';
import ConstantArms from 'nbng-universe/constants/arms';
import ConstantBattle from 'nbng-universe/constants/battle';
import ModelCat from 'nbng-universe/model/unit';

import {
	MOVE_DURATION_EACH_GRID,
	HP_BAR_HEIGHT,
	FONT_SIZE_RATIO
} from '../configs/battle';

import {
	COLOR_FOCUS
} from '../configs/ui';

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

export default class extends ModelCat {
	constructor(scene, servData) {
		const db = NbngUniverse.getUnitData(servData.id);
		super(db);

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

		const ctnLen = grid * 0.9; // The avatar container size
		const buffIconLen = ctnLen/5;
		const headerIconLen = grid/5;
		const [vert, hori] = this._servData.grid; // Current cat position grid

		const img = this._scene.add.image(
			0, 
			0, 
			this.getId()
		).setDisplaySize(ctnLen, ctnLen);

		// The container to contain all sprites
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

		// Nature icons
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
		this._debuffIcons = [];
		for(let i = 0; i < STAT_TO_ICON.length; i++) {
			const bundle = STAT_TO_ICON[i];

			const gameObj = this._scene.add.image(
				buffIconLen * i - ctnLen/2 + buffIconLen/2,
				ctnLen/2 - HP_BAR_HEIGHT - buffIconLen/2,
				bundle.debuff
			).setDisplaySize(buffIconLen, buffIconLen);

			gameObj.alpha = 0;
			this._debuffIcons.push(gameObj);
			this._avatar.add(gameObj);
		}

		this._leaderIcon = this._addHeaderIcon(grid, 0, 'icon_leader', headerIconLen, this.isLeader());
		this._avatar.add(this._leaderIcon);

		// Status icon
		this._talismanIcon = this._addHeaderIcon(grid, 1, 'icon_talisman', headerIconLen, false);
		this._disabledIcon = this._addHeaderIcon(grid, 1, 'icon_disabled', headerIconLen, false);
		this._messIcon = this._addHeaderIcon(grid, 1, 'icon_mess', headerIconLen, false);
		this._betrayIcon = this._addHeaderIcon(grid, 1, 'icon_betray', headerIconLen, false);
		this._statusIcons = {
			[ConstantBattle.STATUS.TALISMAN]: this._talismanIcon,
			[ConstantBattle.STATUS.DISABLED]: this._disabledIcon,
			[ConstantBattle.STATUS.MESS]: this._messIcon,
			[ConstantBattle.STATUS.BETRAY]: this._betrayIcon
		};

		this._tauntIcon = this._addHeaderIcon(grid, 2, 'icon_taunt', headerIconLen, false);
		this._hideIcon = this._addHeaderIcon(grid, 3, 'icon_hide', headerIconLen, false);
		this._angerIcon = this._addHeaderIcon(grid, 4, 'icon_anger', headerIconLen, false);

		// Setup cry animation
		this._crySprite = this._scene.add.sprite(
			0, 
			0, 
			'cry_1'
		);
		this._crySprite.visible = false;
		this._avatar.add(this._crySprite);

		// Setup boom animation
		this._boomSprite = this._scene.add.sprite(
			0,
			0,
			'boom'
		).setDisplaySize(grid, grid);
		this._boomSprite.visible = false;
		this._avatar.add(this._boomSprite);

		// Setup anger animation
		this._angerSprite = this._scene.add.sprite(
			0,
			0,
			'anger'
		).setDisplaySize(grid, grid);
		this._angerSprite.visible = false;
		this._avatar.add(this._angerSprite);
	}

	_addHeaderIcon = (gridLen, index, imgKey, iconLen, isShow) => {
		const gameObj = this._scene.add.image(
			gridLen/2 * -1 + iconLen/2 + iconLen * index,
			gridLen/2 * -1 + iconLen/2,
			imgKey
		).setDisplaySize(iconLen*1.5, iconLen*1.5);

		gameObj.visible = isShow;
		this._avatar.add(gameObj);
		return gameObj;
	}

	isLeader = () => {
		return !!this._servData.leader;
	}

	updateHpBar = () => {
		this._hpbar.width = this.getCurHp() / this.getMaxHp() * (this._avatar.width);
		this._updateScene();
	}

	_updateScene = () => {
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

		this.updateHpBar();
		return this._hp;
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

	move = async (grid, delay=0) => {
		await this.moveVertical(grid);
		await this.moveHorizontal(grid, delay);
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

	moveHorizontal = (toGrid, delay=0) => {
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
				completeDelay: delay,
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
	attack = (targetBattleCat) => {
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

			switch(this.getArm()) {
				case ConstantArms.INFANTRY:
					this._scene.sound.play('atk_infantry', { volume: 0.5 });
					break;
				case ConstantArms.CALVALRY:
					this._scene.sound.play('atk_calvalry', { volume: 0.5 });
					break;
				case ConstantArms.GUNMAN:
				default:
					this._scene.sound.play('atk_gun', { volume: 0.5 });
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
		});
	}

	// // The animation to identify unit is using skill
	// damageSkill = (targetBattleCat) => {
	// 	return new Promise((resolve) => {
	// 		let opt;
	// 		const curGrid = this.getCurGrid();
	// 		const [curGV, curGH] = curGrid;
	// 		const [tarGV, tarGH] = targetBattleCat.getCurGrid();
	// 		const isSameRow = curGV === tarGV;

	// 		const [curPosX, curPosY] = this.getMyCurPos();
	// 		const {grid} = this._scene.getMapStat();

	// 		if (isSameRow) {
	// 			opt = curGH > tarGH ? {x: curPosX + grid/2} : {x: curPosX - grid/2}
	// 		} else {
	// 			opt = curGV > tarGV ? {y: curPosY - grid/2} : {y: curPosY + grid/2}
	// 		}

	// 		// this._scene.sound.play('attack', {
	// 		// 	volume: 0.5
	// 		// })

	// 		switch(this.getArm()) {
	// 			case ConstantArms.INFANTRY:
	// 				this._scene.sound.play('atk_infantry', { volume: 0.5 });
	// 				break;
	// 			case ConstantArms.CALVALRY:
	// 				this._scene.sound.play('atk_calvalry', { volume: 0.5 });
	// 				break;
	// 			case ConstantArms.GUNMAN:
	// 			default:
	// 				this._scene.sound.play('atk_gun', { volume: 0.5 });
	// 		}

	// 		// Move backward and attack forward
	// 		this._scene.tweens.add(Object.assign({}, opt, {
	// 			targets: this._avatar,
	// 			duration: 50,
	// 			ease: "Power2",
	// 			yoyo: true,
	// 			loop: 0,
	// 			onComplete: resolve,
	// 		}));
	// 	});
	// }

	// Display hurt animation
	// @action: which action type trigger this hurt effect, ATTACK/SKILL
	hurt = (dmg, action) => {
		return new Promise((resolve) => {
			// Shake the avatar
			this._scene.cameras.main.shake(300, 0.005, true);

			// Update HP
			const curHp = this.changeHp(-1 * dmg);

			// Display damage
			const txt = this._scene.add.text(
				this._avatar.x,
				this._avatar.y - 20,
				dmg,
				{
					fontSize: this._getEffectFontSize(), 
					fill: '#fc0f03',
					strokeThickness: 5,
					stroke: '#fff'
				}
			).setOrigin(0.5);

			this._scene.sound.play('hurt', {
				volume: 0.5
			});

			// Reduce HP by skill
			if (action === ConstantBattle.ACTION.SKILL) {
				this._boomSprite.visible = true;
				this._boomSprite.play('boom-anim');
			}

			this._scene.tweens.add({
				targets: txt,
				y: this._avatar.y - 40,
				duration: 1200,
				alpha: { from: 1, to: 0 },
				ease: "Back.easeIn",
				onComplete: () => {
					txt.destroy();

					if (curHp <= 0) {
						this.playRetreat().then(resolve);
					} else {
						resolve();
					}
				}
			});
		})
	}

	playRetreat = () => {
		return new Promise((resolve) => {
			this._crySprite.visible = true;
			this._crySprite.play('cry-anim');

			this._scene.sound.play('cry', {
				volume: 0.5
			})

			this._scene.tweens.add({
				targets: this._avatar,
				duration: 1000,
				alpha: { from: 1, to: 0 },
				ease: "Back.easeIn",
				onComplete: resolve
			})
		})
	}

	heal = (amount) => {
		return new Promise((resolve) => {
			this.changeHp(amount); // Update HP

			// Display damage
			const txt = this._scene.add.text(
				this._avatar.x,
				this._avatar.y - 20,
				amount,
				{
					fontSize: this._getEffectFontSize(), 
					fill: '#42ed7e',
					strokeThickness: 5,
					stroke: '#fff'
				}
			).setOrigin(0.5);

			this._scene.sound.play('heal', {
				volume: 0.3
			});

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

	focus = (color=COLOR_FOCUS) => {
		return new Promise((resolve) => {
			// Draw a retangle around avatar
			const rect = this._scene.add.rectangle(
				this._avatar.x, 
				this._avatar.y, 
				this._avatar.width + 20,
				this._avatar.height + 20
			);

			// rect.setStrokeStyle(5, Phaser.Display.Color.GetColor(252, 186, 3), 0.8);
			rect.setStrokeStyle(5, color, 0.8);

			// 
			this._scene.tweens.add({
				targets: rect,
				scale: this._avatar.width / (this._avatar.width + 20),
				duration: 300,
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
			this._scene.sound.play('dodge', {
				volume: 0.5
			});

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

	effect = async (list, action) => {
		for(const eft of list) {
			const { type } = eft;

			// Break down to single effect
			switch(type) {
				case ConstantBattle.EFFECT.DAMAGE: {
					await this.hurt(eft.value, action);
					break;
				}

				case ConstantBattle.EFFECT.NATURE: {
					for(let i = 0; i < STATS.length; i++) {
						const prop = STATS[i]; // 'fire', 'land', etc
						if (!_.has(eft, prop)) { continue; }

						switch(eft[prop]) {
							case 0: {
								this.hideBuff(i);
								break;
							}
							case 1: {
								this.hideBuff(i);
								const iconObj = this.getBuffIconByIndex(i);
								await this.playBuff(iconObj);
								iconObj.alpha = 1;
								break;
							}
							case 2: {
								this.hideBuff(i);
								const iconObj = this.getDebuffIconByIndex(i);
								await this.playDebuff(iconObj);
								iconObj.alpha = 1;
								break;
							}
						}

						this._updateScene();
					}

					break;
				}

				case ConstantBattle.EFFECT.HEAL: {
					await this.heal(eft.value);
					break;
				}

				case ConstantBattle.EFFECT.STATUS: {
					await this.setStatus(eft.status);
					break;
				}

				case ConstantBattle.EFFECT.ANGER: {
					await this.toggleAnger(eft.on);
					break;
				}

				case ConstantBattle.EFFECT.HIDE: {
					await this.toggleHide(eft.on);
					await this.playHide();
					break;
				}

				case ConstantBattle.EFFECT.TAUNT: {
					await this.toggleTaunt(eft.on);
					break;
				}
			}
		}
	}

	hideBuff = (index) => {
		this.getBuffIconByIndex(index).alpha = 0;
		this.getDebuffIconByIndex(index).alpha = 0;
	}

	getBuffIconByIndex = (index) => {
		return this._buffIcons[index];
	}

	getDebuffIconByIndex = (index) => {
		return this._debuffIcons[index];
	}

	playBuff = (gameObj) => {
		return new Promise((resolve) => {
			this._scene.sound.play('buff', {
				volume: 0.5
			});

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

	playDebuff = (gameObj) => {
		return new Promise((resolve) => {
			this._scene.sound.play('debuff', {
				volume: 0.5
			});

			this._scene.tweens.add({
				targets: gameObj,
				alpha: { from: 0, to: 1 },
				y: '+=5',
				yoyo: true,
				duration: 300,
				ease: "Power1",
				repeat: 1,
				onComplete: resolve
			});
		})
	}

	// In case the screen width and height are extreme (etc very large width and little height), the font size will be very large
	_getEffectFontSize = () => {
		return `${Math.min(this._scene.game.config.width, this._scene.game.config.height) * FONT_SIZE_RATIO}px`
	}

	setStatus = async (statusKey) => {
		for(const prop in this._statusIcons) {
			if(statusKey === prop) {
				const gameObj = this._statusIcons[prop]
				this._statusIcons[prop].visible = true;

				switch(statusKey) {
					case ConstantBattle.STATUS.TALISMAN:
						this._scene.sound.play('talisman', {
							volume: 0.5
						})
						break;
				}
				await this.blink(gameObj);
			} else {
				this._statusIcons[prop].visible = false;
			}
		}

		this._updateScene();
	}

	toggleAnger = async (isOn) => {
		if (isOn) {
			this._scene.sound.play('anger', {
				volume: 0.5
			});

			await this.playAngerAnim();
		}

		this._angerIcon.visible = isOn;
		// await this.blink(this._angerIcon);
		await this.fadeIn(this._angerIcon, 500);
		this._updateScene();
	}

	playAngerAnim = () => {
		return new Promise(resolve => {
			this._angerSprite.once('animationcomplete-fire-anim', resolve);
			this._angerSprite.visible = true;
			this._angerSprite.play('fire-anim');
		})
	}

	toggleHide = async (isOn) => {
		this._hideIcon.visible = isOn;

		if (isOn) {
			this._scene.sound.play('hide', {
				volume: 0.5
			})
		}
		await this.blink(this._hideIcon);
		this._updateScene();
	}

	toggleTaunt = async (isOn) => {
		this._tauntIcon.visible = isOn;

		if (isOn) {
			this._scene.sound.play('taunt', {
				volume: 0.5
			});
		}

		await this.blink(this._tauntIcon);
		this._updateScene();
	}

	blink = (gameObj, duration=300) => {
		return new Promise((resolve) => {
			this._scene.tweens.add({
				targets: gameObj,
				alpha: { from: 1, to: 0 },
				yoyo: true,
				duration: duration,
				ease: "Power1",
				repeat: 0,
				onComplete: resolve
			})
		})
	}

	fadeIn = (gameObj, duration=300) => {
		return new Promise((resolve) => {
			this._scene.tweens.add({
				targets: gameObj,
				alpha: 1,
				duration: duration,
				ease: "Power1",
				repeat: 0,
				onComplete: resolve
			})
		})
	}

	playHide = () => {
		return new Promise((resolve) => {
			this._scene.tweens.add({
				targets: this._avatar,
				alpha: { from: 1, to: 0.5 },
				duration: 300,
				ease: "Power1",
				onComplete: resolve
			})
		})
	}
}