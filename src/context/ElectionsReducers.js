import find from "lodash.find";
import orderBy from "lodash.orderby";
import { ACTIONS } from "./ElectionsActions";

export function reducer(state, action) {
	switch (action.type) {
		case ACTIONS.ADD_SELECTED_CITY_ID:
			return { ...state, selectedCityId: action.payload };
		case ACTIONS.CLEAR_ELECTION:
			const newState = { ...state };
			delete newState.election;
			return newState;
		case ACTIONS.ADD_CITIES:
			return { ...state, cities: action.payload.cities };
		case ACTIONS.ADD_ELECTION:
			return {
				...state,
				election: {
					city: action.payload.city,
					candidates: orderBy(action.payload.election, ['votes'], ['desc']).map((votation, i) => {
						const { name: candidateName } = find(action.payload.candidates, { id: votation.candidateId });
						return {
							...votation,
							candidateName,
							percentage: ((votation.votes * 100) / action.payload.city.presence).toFixed(2),
							elected: i === 0 ? true : false,
						};
					}),
				},
			};
		default:
			throw new Error();
	}
}