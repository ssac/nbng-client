
var ConsBattle = require('nbng-universe/constants/battle');

export default {
	data: {
		map: [
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1]
		],
		units: [{
			tid: '1',
			id: '1001',
			grid: [1, 4],
			hp: 1000,
			max_hp: 1000,
			team: 1,
			leader: true
		}, {
			tid: '2',
			id: '1002',
			grid: [2, 3],
			hp: 1000,
			max_hp: 1000,
			team: 1
		}, {
			tid: '3',
			id: '1003',
			grid: [2, 5],
			hp: 1000,
			max_hp: 1000,
			team: 1
		}, {
			tid: '4',
			id: '1004',
			grid: [3, 2],
			hp: 1000,
			max_hp: 1000,
			team: 1
		}, {
			tid: '5',
			id: '1005',
			grid: [3, 6],
			hp: 1000,
			max_hp: 1000,
			team: 1
		}, {
			tid: '6',
			id: 'C6001',
			grid: [5, 6],
			hp: 1000,
			max_hp: 1000,
			team: 2
		}, {
			tid: '7',
			id: 'C1001',
			grid: [5, 2],
			hp: 1000,
			max_hp: 1000,
			team: 2
		}, {
			tid: '8',
			id: 'C1002',
			grid: [6, 5],
			hp: 1000,
			max_hp: 1000,
			team: 2,
			leader: true
		}, {
			tid: '9',
			id: 'C1003',
			grid: [6, 3],
			hp: 1000,
			max_hp: 1000,
			team: 2
		}, {
			tid: '10',
			id: 'C2001',
			grid: [7, 4],
			hp: 1000,
			max_hp: 1000,
			team: 2
		}],
		turns: [
			{
				result: 1, // 1 = win, 2 = lose, 3 = draw
				logs: [
					{
						tid: '1',
						actions: [
							{
								action: ConsBattle.ACTION.MOVE,
								to: [5, 7]
							},
							{
								action: ConsBattle.ACTION.ATTACK,
								target_tid: '6',
					// 			// One action may trigger multiple reactions
					// 			// Normalize the reactions as list type makes the game possible to Multiple cover against attack
					// 			// reactions: [
					// 			// 	{
					// 			// 		type: ConsBattle.REACTION.DODGE,
					// 			// 		reactor_tid: '6'
					// 			// 	},
					// 			// 	{
					// 			// 		type: ConsBattle.REACTION.COUNTER,
					// 			// 		reactor_tid: '6'
					// 			// 	},
					// 			// 	{
					// 			// 		type: ConsBattle.REACTION.COVER,
					// 			// 		reactor_tid: '3'
					// 			// 	},
					// 			// 	{
					// 			// 		type: ConsBattle.REACTION.PROTECT,
					// 			// 		reactor_tid: '3',
					// 			// 	},
					// 			// ],
								effects: [
									{
										tid: '6',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 300
											},
											// {
											// 	type: ConsBattle.EFFECT.STATUS,
											// 	effect: 'TALISMAN' // 'BETRAY', 'MESS', 'DISABLED', 'NONE'
											// },
											// {
											// 	type: ConsBattle.EFFECT.HEAL,
											// 	value: 100
											// },
											// {
											// 	type: ConsBattle.EFFECT.NATURE,
											// 	fire: 0, // 0 == dismiss, 1 == up, 2 == down
											// 	land: 0,
											// 	wind: 0,
											// 	water: 0,
											// 	moon: 0
											// },
											// {
											// 	type: ConsBattle.EFFECT.ANGER,
											// 	on: true
											// },
											// {
											// 	type: ConsBattle.EFFECT.HIDE,
											// 	on: true // true = hide, false = appear
											// },
											// {
											// 	type: ConsBattle.EFFECT.TAUNT,
											// 	on: true
											// }
										]
									},
					// 				// // Next cat got effect if exist
					// 				// {

					// 				// }
								]
							}
						]
					},
					{
						tid: '2',
						actions: [
							{
								action: ConsBattle.ACTION.SKILL,
								skill: '小豆袋',
								target_tids: ['1', '2', '3', '4', '5'],
								effects: [
									{
										tid: '1',
										list: [
											{
												type: ConsBattle.EFFECT.HEAL,
												value: 110
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												moon: 1
											}
										]
									},
									{
										tid: '2',
										list: [
											{
												type: ConsBattle.EFFECT.HEAL,
												value: 110
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												moon: 1
											}
										]
									},
									{
										tid: '3',
										list: [
											{
												type: ConsBattle.EFFECT.HEAL,
												value: 110
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												moon: 1
											}
										]
									},
									{
										tid: '4',
										list: [
											{
												type: ConsBattle.EFFECT.HEAL,
												value: 110
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												moon: 1
											}
										]
									},
									{
										tid: '5',
										list: [
											{
												type: ConsBattle.EFFECT.HEAL,
												value: 110
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												moon: 1
											}
										]
									},
								]
							}
						]
					},
					{
						tid: '3',
						actions: [
							{
								action: ConsBattle.ACTION.SKILL,
								skill: '狙擊',
								target_tids: ['7'],
								effects: [
									// {
									// 	tid: '3',
									// 	list: [
									// 		{
									// 			type: ConsBattle.EFFECT.ANGER,
									// 			on: true
									// 		}
									// 	]
									// },
									// {
									// 	tid: '4',
									// 	list: [
									// 		{
									// 			type: ConsBattle.EFFECT.ANGER,
									// 			on: true
									// 		}
									// 	]
									// },
									{
										tid: '7',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 455
											}
										]
									}
								]
							}
						]
					},
					{
						tid: '4',
						actions: [
							{
								action: ConsBattle.ACTION.ATTACK,
								target_tid: '7',
								reactions: [
									{
										type: ConsBattle.REACTION.COUNTER,
										reactor_tid: '7'
									}
								],
								effects: [
									{
										tid: '4',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 400 // Attacker gets damage by counter attack
											}
										]
									}
								]
							}
						]
					},
					{
						tid: '5',
						actions: [
							{
								action: ConsBattle.ACTION.MOVE,
								to: [4, 6]
							},
							{
								action: ConsBattle.ACTION.SKILL,
								skill: '鬼島津',
								target_tids: ['1', '2', '3', '4', '5'],
								effects: [
									{
										tid: '1',
										list: [
											{
												type: ConsBattle.EFFECT.NATURE,
												fire: 1,
												land: 1,
												wind: 1
											}
										]
									},
									{
										tid: '2',
										list: [
											{
												type: ConsBattle.EFFECT.NATURE,
												fire: 1,
												land: 1,
												wind: 1
											}
										]
									},
									{
										tid: '3',
										list: [
											{
												type: ConsBattle.EFFECT.NATURE,
												fire: 1,
												land: 1,
												wind: 1
											}
										]
									},
									{
										tid: '4',
										list: [
											{
												type: ConsBattle.EFFECT.NATURE,
												fire: 1,
												land: 1,
												wind: 1
											}
										]
									},
									{
										tid: '5',
										list: [
											{
												type: ConsBattle.EFFECT.NATURE,
												fire: 1,
												land: 1,
												wind: 1
											}
										]
									},
								]
							}
						]
					},
					{
						tid: '6',
						actions: [
							{
								action: ConsBattle.ACTION.SKILL,
								skill: '水之呼吸',
								target_tids: ['6', '7', '8', '9', '10'],
								effects: [
									{
										tid: '6',
										list: [
											{
												type: ConsBattle.EFFECT.HEAL,
												value: 323
											},
											// {
											// 	type: ConsBattle.EFFECT.STATUS,
											// 	status: 'TALISMAN'
											// }
											{
												type: ConsBattle.EFFECT.NATURE,
												fire: 1
											}
										]
									},
									{
										tid: '7',
										list: [
											{
												type: ConsBattle.EFFECT.HEAL,
												value: 362
											},
											// {
											// 	type: ConsBattle.EFFECT.STATUS,
											// 	status: 'TALISMAN'
											// }
											{
												type: ConsBattle.EFFECT.NATURE,
												fire: 1
											}
										]
									},
									{
										tid: '8',
										list: [
											{
												type: ConsBattle.EFFECT.HEAL,
												value: 266
											},
											// {
											// 	type: ConsBattle.EFFECT.STATUS,
											// 	status: 'TALISMAN'
											// }
											{
												type: ConsBattle.EFFECT.NATURE,
												fire: 1
											}
										]
									},
									{
										tid: '9',
										list: [
											{
												type: ConsBattle.EFFECT.HEAL,
												value: 266
											},
											// {
											// 	type: ConsBattle.EFFECT.STATUS,
											// 	status: 'TALISMAN'
											// }
											{
												type: ConsBattle.EFFECT.NATURE,
												fire: 1
											}
										]
									},
									{
										tid: '10',
										list: [
											{
												type: ConsBattle.EFFECT.HEAL,
												value: 266
											},
											// {
											// 	type: ConsBattle.EFFECT.STATUS,
											// 	status: 'TALISMAN'
											// }
											{
												type: ConsBattle.EFFECT.NATURE,
												fire: 1
											}
										]
									},
								]
							},
						]
					},
					{
						tid: '10',
						actions: [
							{
								action: ConsBattle.ACTION.MOVE,
								to: [4, 4]
							},
							{
								action: ConsBattle.ACTION.SKILL,
								skill: '暗示',
								target_tids: ['2', '3', '4', '5'],
								effects: [
									{
										tid: '2',
										list: [
											{
												type: ConsBattle.EFFECT.TAUNT,
												on: true
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												land: 2
											}
										]
									},
									{
										tid: '3',
										list: [
											{
												type: ConsBattle.EFFECT.TAUNT,
												on: true
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												land: 2
											}
										]
									},
									{
										tid: '4',
										list: [
											{
												type: ConsBattle.EFFECT.TAUNT,
												on: true
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												land: 2
											}
										]
									},
									{
										tid: '5',
										list: [
											{
												type: ConsBattle.EFFECT.TAUNT,
												on: true
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												land: 2
											}
										]
									},
								]
							},
						]
					},
					{
						tid: '8',
						actions: [
							{
								action: ConsBattle.ACTION.SKILL,
								skill: '雷之呼吸',
								target_tids: ['3', '4', '5'],
								effects: [
									{
										tid: '3',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 323
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												wind: 2
											}
										]
									},
									{
										tid: '4',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 313
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												wind: 2
											}
										]
									},
									{
										tid: '5',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 297
											},
											{
												type: ConsBattle.EFFECT.NATURE,
												wind: 2
											}
										]
									},
								]
							}
						]
					},
					// {
					// 	tid: '10',
					// 	actions: [
					// 		{	
					// 			action: ConsBattle.ACTION.SKILL,
					// 			skill: '暗示',
					// 			target_tids: ['6', '7', '8', '9', '10'],
					// 			effects: [
					// 				{
					// 					tid: '6',
					// 					list: [
					// 						{
					// 							type: ConsBattle.EFFECT.HIDE,
					// 							on: true
					// 						}
					// 					]
					// 				},
					// 				{
					// 					tid: '7',
					// 					list: [
					// 						{
					// 							type: ConsBattle.EFFECT.HIDE,
					// 							on: true
					// 						}
					// 					]
					// 				},
					// 				{
					// 					tid: '8',
					// 					list: [
					// 						{
					// 							type: ConsBattle.EFFECT.HIDE,
					// 							on: true
					// 						}
					// 					]
					// 				},
					// 				{
					// 					tid: '9',
					// 					list: [
					// 						{
					// 							type: ConsBattle.EFFECT.HIDE,
					// 							on: true
					// 						}
					// 					]
					// 				},
					// 				{
					// 					tid: '10',
					// 					list: [
					// 						{
					// 							type: ConsBattle.EFFECT.HIDE,
					// 							on: true
					// 						}
					// 					]
					// 				},
					// 			]
					// 		}
					// 	]
					// },
					{
						tid: '7',
						actions: [
							{
								action: ConsBattle.ACTION.SKILL,
								skill: '血鬼術',
								target_tids: ['1', '2', '3', '4', '5'],
								effects: [
									{
										tid: '1',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 9999
											}
										]
									},
									{
										tid: '2',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 9999
											}
										]
									},
									{
										tid: '3',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 9999
											}
										]
									},
									{
										tid: '4',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 9999
											}
										]
									},
									{
										tid: '5',
										list: [
											{
												type: ConsBattle.EFFECT.DAMAGE,
												value: 9999
											}
										]
									},
								]
							}
						]
					}
				],
			}
		]
	}
}