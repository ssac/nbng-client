import Phaser from "phaser";
import _ from 'lodash';
import NbngUniverse from 'nbng-universe';
import ConsSkillSystem from 'nbng-universe/constants/skill-system';
import ConsBattle from 'nbng-universe/constants/battle';


import BattleCat from '../models/battle-cat';
import NatureToColor from '../utils/nature-to-color';

import {
	BATTLE_FIELD_PADDING_HORI,
	BATTLE_FIELD_PADDING_VERT,
	DESC_OVERLAY_HEIGHT_RATIO
} from '../configs/battle';

function calcMapStat(width, height, numOfHorizGrid, numOfVertGrid) {
	const grid = Math.min((width - BATTLE_FIELD_PADDING_HORI * 2) / numOfHorizGrid, (height - BATTLE_FIELD_PADDING_VERT * 2) / numOfVertGrid);

	const x = BATTLE_FIELD_PADDING_HORI + ((width - BATTLE_FIELD_PADDING_HORI * 2) - grid * numOfHorizGrid) / 2;
	const y = BATTLE_FIELD_PADDING_VERT + ((height - BATTLE_FIELD_PADDING_VERT * 2) - grid * numOfVertGrid) / 2;

	return {
		x,
		y,
		width: width - x * 2,
		height: height - y * 2,
		grid
	}
}

export default class extends Phaser.Scene {
	constructor() {
		super('battle');
	}

	init (initData) {
		const {
			map,
			units,
			turns
		} = initData.data;

		this._map = map;
		this._units = units;
		this._turns = turns;

		this._cats = [];

		this._mapStat = calcMapStat(
			this.game.config.width,
			this.game.config.height,
			map[0].length,
			map.length
		);

		this._units.forEach((servData) => {
			const {tid} = servData;

			this._cats.push({
				tid: tid,
				cat: new BattleCat(this, servData)
			});
		})
	}

	getMapStat () {
		return this._mapStat;
	}

	preload () {
		// Prepare battle fields
		this.load.image('grass', require('../assets/map/grass.png'));

		this.load.image('icon_buff_fire', require('../assets/battle/icon_buff_1.png'));
		this.load.image('icon_buff_land', require('../assets/battle/icon_buff_2.png'));
		this.load.image('icon_buff_wind', require('../assets/battle/icon_buff_3.png'));
		this.load.image('icon_buff_water', require('../assets/battle/icon_buff_4.png'));
		this.load.image('icon_buff_moon', require('../assets/battle/icon_buff_5.png'));

		this.load.image('icon_debuff_fire', require('../assets/battle/icon_debuff_1.png'));
		this.load.image('icon_debuff_land', require('../assets/battle/icon_debuff_2.png'));
		this.load.image('icon_debuff_wind', require('../assets/battle/icon_debuff_3.png'));
		this.load.image('icon_debuff_water', require('../assets/battle/icon_debuff_4.png'));
		this.load.image('icon_debuff_moon', require('../assets/battle/icon_debuff_5.png'));

		this.load.image('icon_disabled', require('../assets/battle/icon_stat_1.png'));
		this.load.image('icon_mess', require('../assets/battle/icon_stat_2.png'));
		this.load.image('icon_betray', require('../assets/battle/icon_stat_3.png'));
		this.load.image('icon_taunt', require('../assets/battle/icon_stat_4.png'));
		this.load.image('icon_hide', require('../assets/battle/icon_stat_5.png'));
		this.load.image('icon_anger', require('../assets/battle/icon_stat_6.png'));
		this.load.image('icon_talisman', require('../assets/battle/icon_stat_7.png'));

		this.load.image('start_1', require('../assets/battle/start/txt_sentoukaisi_0.png'));
		this.load.image('start_2', require('../assets/battle/start/txt_sentoukaisi_1.png'));
		this.load.image('start_3', require('../assets/battle/start/txt_sentoukaisi_2.png'));
		this.load.image('start_4', require('../assets/battle/start/txt_sentoukaisi_3.png'));

		this.load.image('icon_leader', require('../assets/battle/icon_leader.png'));

		this.load.image('cry_1', require('../assets/battle/ase01.png'));
		this.load.image('cry_2', require('../assets/battle/ase02.png'));
		this.load.image('cry_3', require('../assets/battle/ase03.png'));

		this.load.image('txt_start_0', require('../assets/battle/start/txt_sentoukaisi_0.png'));
		this.load.image('txt_start_1', require('../assets/battle/start/txt_sentoukaisi_1.png'));
		this.load.image('txt_start_2', require('../assets/battle/start/txt_sentoukaisi_2.png'));
		this.load.image('txt_start_3', require('../assets/battle/start/txt_sentoukaisi_3.png'));

		this.load.image('txt_result_win', require('../assets/battle/result/letter_result01_zh.png'));
		this.load.image('txt_result_draw', require('../assets/battle/result/letter_result02_zh.png'));
		this.load.image('txt_result_lose', require('../assets/battle/result/letter_result03_zh.png'));

		this.load.audio('heal', require('../assets/battle/audio/se_n_112.mp3'));
		this.load.audio('hurt', require('../assets/battle/audio/se_g_018.mp3'));
		this.load.audio('cry', require('../assets/battle/audio/se_g_032.mp3'));
		this.load.audio('taunt', require('../assets/battle/audio/se_g_001.mp3'));
		this.load.audio('attack', require('../assets/battle/audio/se_g_063.mp3'));
		this.load.audio('bgm', require('../assets/battle/audio/bgm_n_02.mp3'));
		this.load.audio('start', require('../assets/battle/audio/se_g_011.mp3'));
		this.load.audio('skill', require('../assets/battle/audio/se_g_038.mp3'));
		this.load.audio('dodge', require('../assets/battle/audio/se_n_007.mp3'));
		this.load.audio('debuff', require('../assets/battle/audio/se_g_026.mp3'));
		this.load.audio('hide', require('../assets/battle/audio/se_g_003.mp3'));
		this.load.audio('anger', require('../assets/battle/audio/se_n_109.mp3'))

		this.load.audio('start', require('../assets/battle/audio/se_g_011.mp3'));
		this.load.audio('win', require('../assets/battle/audio/se_g_060.mp3'));
		this.load.audio('lose', require('../assets/battle/audio/se_g_061.mp3'));
		this.load.audio('draw', require('../assets/battle/audio/se_g_062.mp3'));

		this.load.audio('talisman', require('../assets/battle/audio/se_g_004.mp3'));
		this.load.audio('buff', require('../assets/battle/audio/se_n_113.mp3'));

		this.load.audio('atk_infantry', require('../assets/battle/audio/se_n_003.mp3'));
		this.load.audio('atk_calvalry', require('../assets/battle/audio/se_n_004.mp3'));
		this.load.audio('atk_gun', require('../assets/battle/audio/se_n_005.mp3'));

		this.load.audio('dmg_infantry', require('../assets/battle/audio/se_g_035.mp3'));
		this.load.audio('dmg_calvalry', require('../assets/battle/audio/se_g_036.mp3'));
		this.load.audio('dmg_gun', require('../assets/battle/audio/se_g_037.mp3'));

		// Effect
		this.load.spritesheet(
			'boom', 
			require('../assets/battle/anim/23.png'),
			{frameWidth: 64, frameHeight: 64}
		);

		this.load.spritesheet(
			'anger', 
			require('../assets/battle/anim/eff_0033.png'),
			{frameWidth: 64, frameHeight: 64}
		);

		this._cats.forEach(({cat}) => {
			cat.preload()
		})
	}

	create () {
		this.cameras.main.setBounds(
			0, 
			0, 
			this.game.config.width, 
			this.game.config.height
		);
		
		const {
			x,
			y,
			grid,
			width,
			height
		} = this._mapStat;

		this.createAnims();
		this.createMap();		

		this._cats.forEach(({cat}) => {
			cat.create();
		});

		this.createSkillOverlay();

		// Create a overlay for displaying result screen at the battle end
		this._overlay = this.add.rectangle(
			x,
			y,
			width,
			height,
			Phaser.Display.Color.GetColor(0, 0, 0)
		).setOrigin(0);
		this._overlay.alpha = 0;

		// Run battle logs
		this.playBattle();
	}

	createSkillOverlay () {
		const {
			x,
			y,
			grid,
			width,
			height
		} = this._mapStat;

		// Create skill desc background
		const bgHeight = height * DESC_OVERLAY_HEIGHT_RATIO;
		this._skillBg = this.add.rectangle(
			0,
			0,
			width,
			bgHeight,
			Phaser.Display.Color.GetColor(0, 0, 0)
		).setOrigin(0);
		this._skillBg.alpha = 0.5;

		// Create skill desc text
		this._skillTxt = this.add.text(
			width/2,
			bgHeight/2,
			'',
			{ 
				fontSize: '18px', 
				fill: '#fff',
				stroke: '#000',
				strokeThickness: 2,
				align: "left",
				maxLines: 3,
				padding: {
					left: 20,
					right: 20,
					top: 20,
					bottom: 20
				},
				wordWrap: {
					width: width - 20*2,
					useAdvancedWrap: true
				}
			}
		).setOrigin(0.5);

		// Create a container to wrap the all
		this._skillOverlay = this.add.container(
			x, 
			y + height - bgHeight,
			[this._skillBg, this._skillTxt]
		).setSize(width, bgHeight);
		this._skillOverlay.alpha = 0;
	}

	createAnims () {
		this.anims.create({
			key: 'cry-anim',
			frames: [
				{ key: 'cry_1' },
				{ key: 'cry_2' },
				{ key: 'cry_3', duration: 50 }
			],
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'boom-anim',
			frames: this.anims.generateFrameNumbers('boom'),
			frameRate: 18,
		});

		this.anims.create({
			key: 'fire-anim',
			frames: this.anims.generateFrameNumbers('anger'),
			frameRate: 64,
		});
	}

	createMap () {
		const {
			x,
			y,
			grid,
			width,
			height
		} = this._mapStat;

		// Create battle map
		this._map.forEach((h, hi) => {
			h.forEach((v, vi) => {
				this.add.image(
					x + hi * grid + grid/2, 
					y + vi * grid + grid/2, 
					'grass'
				).setDisplaySize(grid, grid);
			})
		});
	}

	async playBattle () {
		// Play battle bgm
		this._bgm = this.sound.add('bgm', {
			loop: true
		});
		this._bgm.play();

		await this.playStartAnim();
		await this.playTurns();
	}

	playStartAnim() {
		const {
			x,
			y,
			width,
			height,
		} = this._mapStat;

		const paddingHori = width * 0.1;

		return new Promise(resolve => {
			const placeTxt = (index) => {
				const txt = this.add.image(
					x + width/4 * index + width/8,
					y + height/2,
					`txt_start_${index}`
				);

				txt.alpha = 0;
				return txt;
			}

			const timeline = this.tweens.createTimeline();
			const list = []

			for(let i = 0; i < [0,1,2,3].length; i++) {
				const obj = placeTxt(i);
				list.push(obj);

				timeline.add({
					targets: obj,
					alpha: {from: 0, to: 1},
					ease: 'Linear',
					duration: 150,
					completeDelay: i !== 3 ? 0 : 1000,
					onComplete: i !== 3 ? null : () => {
						// Delete all text objects
						list.forEach(obj => {
							obj.destroy();
						});

						resolve();
					}
				})
			}

			this.sound.play('start', { volume: 0.5 });
			timeline.play();
		})
	}

	async playTurns () {
		for(const turn of this._turns) {
			const {
				result,
				logs
			} = turn;

			// Usually ten units action
			await this.playTurn(turn.logs);

			if (result === 1 || result === 2 || result === 3) {
				// Fade out the battle bgm
				this.tweens.add({
					targets: this._bgm,
					volume: 0,
					duration: 4000
				});

				await this.displayOverlay();

				if (result === 1) {
					await this.playWinAnim();
				} else if (result === 2) {
					await this.playDrawAnim();
				} else {
					await this.playLoseAnim();
				}
			}
		}
	}

	async displayOverlay () {
		return new Promise(resolve => {
			this.tweens.add({
				targets: this._overlay,
				alpha: 0.5,
				duration: 2000,
				onComplete: resolve
			});
		})
	}

	async playWinAnim () {
		this.sound.play('win');
		this._playResult('txt_result_win');
	}

	async playLoseAnim () {
		this.sound.play('lose');
		this._playResult('txt_result_lose');
	}

	async playDrawAnim () {
		this.sound.play('draw');
		this._playResult('txt_result_draw');
	}

	async _playResult (txtKey) {
		const {
			x,
			y,
			width,
			height,
		} = this._mapStat;

		this.add.image(
			x + width/2,
			y + height/2,
			txtKey
		)
	}

	async playTurn (turn) {
		for(const catLog of turn) {
			await this.playCatLog(catLog);
		}
	}

	async playCatLog (catLog) {
		const {
			tid: catTid,
			actions: catActions
		} = catLog;

		const cat = this.findCatByTid(catTid);

		for(const catAction of catActions) {
			const {
				action,
				reactions,
				effects
			} = catAction;

			// Play action animation
			switch(action) {
				case ConsBattle.ACTION.MOVE: {
					const {to} = catAction;
					await cat.move(to, 200);
					break;
				}
				case ConsBattle.ACTION.ATTACK: {
					const {
						target_tid
					} = catAction;

					// await cat.focus();
					const defCat = this.findCatByTid(target_tid);
					await cat.attack(defCat);

					break;
				}
				case ConsBattle.ACTION.SKILL: {
					const {
						skill,
						target_tids
					} = catAction;

					const skillIns = NbngUniverse.getSkillInstance(skill);
					await cat.focus(NatureToColor(skillIns.getNature()));
					await this.playSkillCutScene(catTid, skillIns.getName('zh'));
					this.playSkillDesc(skillIns);

					const system = skillIns.getSystem()
					if (
						system === ConsSkillSystem.MAGIC || 
						system === ConsSkillSystem.ATTACK
					) {
						// Play the animation attacking target like normal attack
						await cat.attack(this.findCatByTid(target_tids[0]));
					} else if (
						system === ConsSkillSystem.DEBUFF || 
						system === ConsSkillSystem.REMOVE || 
						system === ConsSkillSystem.DEFENSE
					) {
						await this.playTargetsAreBeingOffcus(target_tids, skillIns);
					}
					break;
				}
				default: {
					console.error("Incorrect log action");
				}
			}

			// If this action is triggered any reaction (counter attack, cover etc)
			if (_.isArray(reactions) && reactions.length > 0) {
				const pms = reactions.map(async (reaction) => {
					const {
						type,
						reactor_tid
					} = reaction;

					const reactorCat = this.findCatByTid(reactor_tid);

					switch(type) {

						// 閃避
						case ConsBattle.REACTION.DODGE: {
							return await reactorCat.dodge()
							break;
						}

						// 反擊
						case ConsBattle.REACTION.COUNTER: {
							return await reactorCat.counter(cat)
							break;
						}

						// 掩護射擊
						// case ConsBattle.REACTION.COVER: {
						// 	break;
						// }

						// 守備
						// case ConsBattle.REACTION.PROTECT: {
						// 	break;
						// }

						default: {
							console.error("Incorrect reaction type");
						}
					}
				});

				await Promise.all(pms);
			}

			// Play any effect triggered (damage, heal, buff/debuff etc)
			if (_.isArray(effects) && effects.length > 0) {
				const pms = effects.map(async (effectOfCat) => {
					const {
						tid,
						list
					} = effectOfCat;

					return await this.findCatByTid(tid).effect(list, action);
				});

				await Promise.all(pms);
			}
		}
	}

	findCatByTid (tid) {
		return _.find(this._cats, {tid})['cat'];
	}

	getPosByGrid ([gridVert, gridHori]) {
		const {
			x,
			y,
			grid
		} = this._mapStat;

		return [
			x + gridHori * grid + grid/2,
			y + gridVert * grid + grid/2
		]
	}

	playSkillDesc (skillIns) {
		return new Promise(resolve => {
			const desc = skillIns.getDesc('zh');
			this._skillTxt.setText(desc);

			this.tweens.add({
				targets: this._skillOverlay,
				duration: 2000,
				alpha: { from: 0, to: 1 },
				yoyo: true,
				ease: "Back.easeOut",
				onComplete: resolve
			});
		})
	}

	playTargetsAreBeingOffcus (tids, skillIns) {
		const pms = tids.map((tid) => {
			return this.findCatByTid(tid).focus(NatureToColor(skillIns.getNature()));
		});

		return Promise.all(pms);
	}

	async playSkillCutScene (catId, skillName) {
		return new Promise((resolve) => {
			const {
				x,
				y,
				width,
				height,
				grid
			} = this._mapStat;

			const cat = this.findCatByTid(catId);

			const bg = this.add.rectangle(
				0,
				0,
				width,
				100,
				Phaser.Display.Color.GetColor(34, 34, 36)
			);

			const icon = this.add.image(
				-1 * width / 2 + grid,
				0,
				cat.getImageKey()
			).setDisplaySize(grid, grid);

			const skill = this.add.text(0, 0, skillName, {
				fontSize: '32px', 
				fill: '#fff',
				fontStyle: 'italic',
				padding: 10
			}).setOrigin(0.5)

			const cutScene = this.add.container(
				this.game.config.width / 2,
				this.game.config.height / 2,
				[bg, icon, skill]
			);

			this.sound.play('skill', {
				volume: 0.5
			})

			this.tweens.add({
				targets: cutScene,
				delay: 800,
				duration: 800,
				alpha: { from: 1, to: 0 },
				ease: "Quad.easeOut",
				onComplete: resolve
			});
		})
	}
}