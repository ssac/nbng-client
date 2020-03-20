
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
			id: '1006',
			grid: [5, 6],
			hp: 1000,
			max_hp: 1000,
			team: 2
		}, {
			tid: '7',
			id: '1007',
			grid: [5, 2],
			hp: 1000,
			max_hp: 1000,
			team: 2
		}, {
			tid: '8',
			id: '1008',
			grid: [6, 5],
			hp: 1000,
			max_hp: 1000,
			team: 2,
			leader: true
		}, {
			tid: '9',
			id: '1009',
			grid: [6, 3],
			hp: 1000,
			max_hp: 1000,
			team: 2
		}, {
			tid: '10',
			id: '1010',
			grid: [7, 4],
			hp: 1000,
			max_hp: 1000,
			team: 2
		}],
		turns: [
			{
				winner_team: -1, // -1 = continue; 1 or 2 = team value,
				logs: [
					{
						tid: '1',
						actions: [
							{
								action: 'MOVE',
								to: [5, 7]
							},
							{
								action: 'ATTACK',
								target_tid: '6',
					// 			// One action may trigger multiple reactions
					// 			// Normalize the reactions as list type makes the game possible to Multiple cover against attack
					// 			// reactions: [
					// 			// 	{
					// 			// 		type: 'DODGE',
					// 			// 		reactor_tid: '6'
					// 			// 	},
					// 			// 	{
					// 			// 		type: 'COUNTER',
					// 			// 		reactor_tid: '6'
					// 			// 	},
					// 			// 	{
					// 			// 		type: 'COVER',
					// 			// 		reactor_tid: '3'
					// 			// 	},
					// 			// 	{
					// 			// 		type: 'PROTECT',
					// 			// 		reactor_tid: '3',
					// 			// 	},
					// 			// ],
								effects: [
									{
										tid: '6',
										list: [
											{
												type: 'DAMAGE',
												value: 300
											},
					// 						// {
					// 						// 	type: 'STATUS',
					// 						// 	effect: 'TALISMAN' // 'BETRAY', 'MESS', 'DISABLED'
					// 						// },
					// 						// {
					// 						// 	type: 'HEAL',
					// 						// 	value: 100
					// 						// },
					// 						// {
					// 						// 	type: 'BUFF/DEBUFF',
					// 						// 	fire: 0, // 0 == dismiss, 1 == up, 2 == down
					// 						// 	land: 0,
					// 						// 	wind: 0,
					// 						// 	water: 0,
					// 						// 	moon: 0
					// 						// },
					// 						// {
					// 						// 	type: 'ANGER',
					// 						// 	on: true
					// 						// },
					// 						// {
					// 						// 	type: 'HIDE',
					// 						// 	on: true // true = hide, false = appear
					// 						// }
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
								action: 'SKILL',
								skill: '小豆袋',
								target_tids: ['1', '2', '3', '4', '5'],
								effects: [
									{
										tid: '1',
										list: [
											{
												type: 'HEAL',
												value: 110
											},
											{
												type: 'BUFF/DEBUFF',
												moon: 1
											}
										]
									},
									{
										tid: '2',
										list: [
											{
												type: 'HEAL',
												value: 110
											},
											{
												type: 'BUFF/DEBUFF',
												moon: 1
											}
										]
									},
									{
										tid: '3',
										list: [
											{
												type: 'HEAL',
												value: 110
											},
											{
												type: 'BUFF/DEBUFF',
												moon: 1
											}
										]
									},
									{
										tid: '4',
										list: [
											{
												type: 'HEAL',
												value: 110
											},
											{
												type: 'BUFF/DEBUFF',
												moon: 1
											}
										]
									},
									{
										tid: '5',
										list: [
											{
												type: 'HEAL',
												value: 110
											},
											{
												type: 'BUFF/DEBUFF',
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
								action: 'ATTACK',
								target_tid: '7',
								reactions: [
									{
										type: 'DODGE',
										reactor_tid: '7'
									}
								]
							}
						]
					},
					{
						tid: '4',
						actions: [
							{
								action: 'ATTACK',
								target_tid: '7',
								reactions: [
									{
										type: 'COUNTER',
										reactor_tid: '7'
									}
								],
								effects: [
									{
										tid: '4',
										list: [
											{
												type: 'DAMAGE',
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
								action: 'MOVE',
								to: [4, 6]
							},
							{
								action: 'SKILL',
								skill: '鬼島津',
								target_tids: ['1', '2', '3', '4', '5'],
								effects: [
									{
										tid: '1',
										list: [
											{
												type: 'BUFF/DEBUFF',
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
												type: 'BUFF/DEBUFF',
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
												type: 'BUFF/DEBUFF',
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
												type: 'BUFF/DEBUFF',
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
												type: 'BUFF/DEBUFF',
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
								action: 'SKILL',
								skill: '陣中見舞',
								target_tids: ['6', '7', '8'],
								effects: [
									{
										tid: '6',
										list: [
											{
												type: 'HEAL',
												value: 323
											}
										]
									},
									{
										tid: '7',
										list: [
											{
												type: 'HEAL',
												value: 362
											}
										]
									},
									{
										tid: '8',
										list: [
											{
												type: 'HEAL',
												value: 266
											}
										]
									},
								]
							},
						]
					}
				],
			}
		]
	}
}