import { useEffect, useState, useReducer, createContext } from 'react';
import { Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { getCandidate, getCities, getElection } from '../services/apiService';
import Election from '../components/Election';
import Header from '../components/Header';
import orderBy from 'lodash.orderby';
import find from 'lodash.find';
import './styles.scss';

const ACTIONS = {
	ADD_CITIES: 'addCities',
	ADD_ELECTION: 'addElection',
	CLEAR_ELECTION: 'clearElection',
};

function reducer(state, action) {
	switch (action.type) {
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
	const [state, dispatch] = useReducer(reducer, []);
	const [selectedCity, setSelectedCity] = useState('');

	useEffect(() => {
		setIsLoading(true);
		const fetchCities = async () => {
			const citiesFromServer = await getCities();
			const cities = orderBy(citiesFromServer, ['name']);
			dispatch({ type: ACTIONS.ADD_CITIES, payload: { cities } });
			setSelectedCity(cities[0].id);
		};
		fetchCities();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const city = find(state.cities, { id: selectedCity });
				const election = await getElection(selectedCity);
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
		};

		if (selectedCity) fetchData();
	}, [selectedCity]);

	const handleSelectedCity = id => {
		setIsLoading(true);
		if (!!id) setSelectedCity(id);
		else {
			dispatch({ type: ACTIONS.CLEAR_ELECTION });
			setSelectedCity('');
			setIsLoading(false);
		}
	};

	return (
		<GlobalContext.Provider value={state}>
			<Header
				title="react-elections"
				selectedCity={selectedCity}
				cities={state.cities}
				onChange={handleSelectedCity}
			/>
			<Container className="py-4">
				{isLoading && (
					<div className="text-center">
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</div>
				)}
				{!isLoading && !state.election && <div></div>}
				{!isLoading && state.election && <Election />}
			</Container>
		</GlobalContext.Provider>
	);
};

export default ElectionsPage;
