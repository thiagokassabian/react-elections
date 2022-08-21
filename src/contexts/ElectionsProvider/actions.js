import { types } from './types';
import { get } from '../../services/httpService';

export const getCities = async dispatch => {
	dispatch({ type: types.LOADING })
	const cities = await get('/cities')
	return () => dispatch({ type: types.CITIES_SUCCESS, payload: { cities } })
}
export const getElection = async (dispatch, city) => {
	dispatch({ type: types.LOADING })
	const election = await get(`/election?cityId=${city.id}`)

	const candidatesFromServer = Promise.all(
		election.map(async candidate => {
			const response = await getCandidate(candidate.candidateId);
			return response[0];
		})
	);
	const candidates = await candidatesFromServer
	return () => dispatch({ type: types.ELECTION_SUCCESS, payload: { election, candidates, city } })
}

export const getCandidate = async id => await get(`/candidates?id=${id}`);

export const changeCity = (dispatch, id) => {
	dispatch({ type: types.SELECTED_CITY_ID_SUCCESS, payload: id })
}
