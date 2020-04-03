import ConsNature from 'nbng-universe/constants/nature';

import {
	COLOR_FIRE,
	COLOR_LAND,
	COLOR_WIND,
	COLOR_WATER,
	COLOR_MOON
} from '../configs/ui';

const _map = {
	[ConsNature.FIRE]: COLOR_FIRE,
	[ConsNature.LAND]: COLOR_LAND,
	[ConsNature.WIND]: COLOR_WIND,
	[ConsNature.WATER]: COLOR_WATER,
	[ConsNature.MOON]: COLOR_MOON
}

export default function(nature) {
	return _map[nature];
}