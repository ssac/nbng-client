import Phaser from "phaser";
import _ from 'lodash';

import BattleCat from '../models/battle-cat';

import {
	WIDTH as GAME_WIDTH,
	HEIGHT as GAME_HEIGHT,
	MAP_PADDING
} from '../configs/game';

function calcMapStat(numOfHorizGrid, numOfVertGrid) {
	const grid = Math.min((GAME_WIDTH - MAP_PADDING * 2) / numOfHorizGrid, (GAME_HEIGHT - MAP_PADDING * 2) / numOfVertGrid);

	const x = MAP_PADDING + ((GAME_WIDTH - MAP_PADDING * 2) - grid * numOfHorizGrid) / 2;
	const y = MAP_PADDING + ((GAME_HEIGHT - MAP_PADDING * 2) - grid * numOfVertGrid) / 2;

	return {
		x,
		y,
		width: GAME_WIDTH - x * 2,
		height: GAME_HEIGHT - y * 2,
		grid
	}
}

const Scene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, 'battle');
	},

	init: function(opts) {
		const {
			map,
			units,
			turns
		} = opts.data;

		this._map = map;
		this._units = units;
		this._turns = turns;

		this._cats = [];
		this._mapStat = calcMapStat(9, 9);

		this._units.forEach((servData) => {
			const {tid} = servData;

			this._cats.push({
				tid: tid,
				cat: new BattleCat(this, servData)
			});
		})
	},

	getMapStat: function() {
		return this._mapStat;
	},

	preload: function() {
		// Prepare battle fields
		this.load.image('grass', require('../assets/map/grass.png'));

		this.load.image('icon_buff_fire', require('../assets/battle/icon_buff_1.png'));
		this.load.image('icon_buff_land', require('../assets/battle/icon_buff_2.png'));
		this.load.image('icon_buff_wind', require('../assets/battle/icon_buff_3.png'));
		this.load.image('icon_buff_water', require('../assets/battle/icon_buff_4.png'));
		this.load.image('icon_buff_moon', require('../assets/battle/icon_buff_5.png'));

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

		this._cats.forEach(({cat}) => {
			cat.preload()
		})
	},

	create: function() {
		this.cameras.main.setBounds(0, 0, 800, 600);

		// Create battle map
		const {
			x,
			y,
			grid
		} = this._mapStat;

		this._map.forEach((h, hi) => {
			h.forEach((v, vi) => {
				this.add.image(x + hi * grid + grid/2, y + vi * grid + grid/2, 'grass').setDisplaySize(grid, grid);
			})
		})

		this._cats.forEach(({cat}) => {
			cat.create();
		});

		// Run battle logs
		this.playBattle();
	},

	playBattle: async function() {
		// Play start animation

		await this.playTurns();

		// Play end animation
	},

	playTurns: async function() {
		for(const turn of this._turns) {
			const {
				winner_team,
				logs
			} = turn;

			await this.playTurn(turn.logs);

			if (turn.winner_team === 1 || turn.winner_team === 2) {
				// Play battle end animation
				break;
			}
		}
	},

	playTurn: async function(turn) {
		for(const catLog of turn) {
			await this.playCatLog(catLog);
		}
	},

	playCatLog: async function(catLog) {
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
				case 'MOVE': {
					const {to} = catAction;
					await cat.move(to);
					break;
				}
				case 'ATTACK': {
					const {
						target_tid
					} = catAction;

					await cat.focus();
					const defCat = this.findCatByTid(target_tid);
					await cat.attack(defCat);

					break;
				}
				case 'SKILL': {
					const {
						skill,
					} = catAction;

					await cat.focus();
					await this.playSkillCutScene(catTid, skill);
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
						case 'DODGE': {
							return await reactorCat.dodge()
							break;
						}

						// 反擊
						case 'COUNTER': {
							return await reactorCat.counter(cat)
							break;
						}

						// 掩護射擊
						// case 'COVER': {
						// 	break;
						// }

						// 守備
						// case 'PROTECT': {
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

					return await this.findCatByTid(tid).effect(list);
				});

				await Promise.all(pms);
			}
		}
	},

	findCatByTid: function(tid) {
		return _.find(this._cats, {tid})['cat'];
	},

	getPosByGrid: function([gridVert, gridHori]) {
		const {
			x,
			y,
			grid
		} = this._mapStat;

		return [
			x + gridHori * grid + grid/2,
			y + gridVert * grid + grid/2
		]
	},

	playSkillCutScene: async function(catId, skillName) {
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
				GAME_WIDTH / 2,
				GAME_HEIGHT / 2,
				[bg, icon, skill]
			);

			this.tweens.add({
				targets: cutScene,
				delay: 800,
				duration: 800,
				// x: GAME_WIDTH,
				alpha: { from: 1, to: 0 },
				ease: "Quad.easeOut",
				onComplete: resolve
			});
		})
	}
});

export default Scene;