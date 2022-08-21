import find from 'lodash.find';
import orderBy from 'lodash.orderby';
import { types } from './types';

export const reducer = (state, action) => {
	switch (action.type) {
		case types.LOADING:
			return { ...state, loading: true };
		case types.CITIES_SUCCESS:
			const orderedCities = orderBy(action.payload.cities, ['name'])
			return { ...state, cities: orderedCities, selectedCityId: orderedCities[0].id, loading: false };
		case types.ELECTION_SUCCESS:
			return {
				...state,
				election: {
					city: action.payload.city,
					candidates: orderBy(action.payload.election, ['votes'], ['desc']).map((elect, i) => {
						const { name: candidateName } = find(action.payload.candidates, { id: elect.candidateId });
						return {
							...elect,
							candidateName,
							percentage: ((elect.votes * 100) / action.payload.city.presence).toFixed(2),
							elected: i === 0 ? true : false,
						};
					}),
				},
				loading: false
			};
		case types.SELECTED_CITY_ID_SUCCESS:
			return { ...state, selectedCityId: action.payload }
		default:
			throw new Error();
	}
}