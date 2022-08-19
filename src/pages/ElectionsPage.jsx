import { useEffect, useState, useReducer, createContext, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { getCandidate, getCities, getElection } from '../services/apiService';
import Election from '../components/Election';
import Header from '../components/Header';
import orderBy from 'lodash.orderby';
import find from 'lodash.find';
import './styles.scss';

export const ACTIONS = {
	ADD_SELECTED_CITY_ID: 'selectedCityId',
	ADD_CITIES: 'addCities',
	ADD_ELECTION: 'addElection',
	CLEAR_ELECTION: 'clearElection',
};

function reducer(state, action) {
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

export const GlobalContext = createContext();

const ElectionsPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [state, dispatch] = useReducer(reducer, {});

	useEffect(() => {
		setIsLoading(true);
		const fetchCities = async () => {
			const citiesFromServer = await getCities();
			const cities = orderBy(citiesFromServer, ['name']);
			dispatch({ type: ACTIONS.ADD_CITIES, payload: { cities } });
			dispatch({ type: ACTIONS.ADD_SELECTED_CITY_ID, payload: cities[0].id });
		};
		fetchCities();
	}, []);

	useEffect(() => {
		setIsLoading(true);
		if (state.selectedCityId)
			(async () => {
				try {
					const city = find(state.cities, { id: state.selectedCityId });
					const election = await getElection(state.selectedCityId);
					const candidatesFromServer = Promise.all(
						election.map(async candidate => {
							const response = await getCandidate(candidate.candidateId);
							return response[0];
						})
					);
					candidatesFromServer.then(candidates => {
						dispatch({
							type: ACTIONS.ADD_ELECTION,
							payload: { city, election, candidates },
						});
						setIsLoading(false);
					});
				} catch (err) {
					console.log(err.message);
				}
			})();
	}, [state.selectedCityId]);

	return (
		<GlobalContext.Provider value={[state, dispatch]}>
			<Header title="react-elections" />
			<Container className="py-4">
				{isLoading && (
					<div className="text-center">
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</div>
				)}
				{!isLoading && state.election && <Election />}
			</Container>
		</GlobalContext.Provider>
	);
};

export default ElectionsPage;
