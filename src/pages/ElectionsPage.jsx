import { useEffect, useState, useReducer } from 'react';
import { Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { getCandidate, getCities, getElection } from '../services/apiService';
import Election from '../components/Election';
import Header from '../components/Header';
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
					candidates: action.payload.election
						.sort((a, b) => b.votes - a.votes)
						.map((votation, i) => {
							const { name: candidateName } = action.payload.candidates.find(
								c => c.id === votation.candidateId
							);
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

const ElectionsPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [state, dispatch] = useReducer(reducer, []);

	useEffect(() => {
		const fetchCities = async () => {
			const citiesFromServer = await getCities();
			dispatch({ type: ACTIONS.ADD_CITIES, payload: { cities: citiesFromServer } });
		};
		fetchCities();
	}, []);

	const fetchData = async id => {
		try {
			const city = state.cities.find(city => city.id === id);
			const electionFromServer = await getElection(id);
			const candidatesFromServer = Promise.all(
				electionFromServer.map(async candidate => {
					const response = await getCandidate(candidate.candidateId);
					return response[0];
				})
			);
			candidatesFromServer.then(candidates => {
				dispatch({
					type: ACTIONS.ADD_ELECTION,
					payload: { city: city, election: electionFromServer, candidates: candidates },
				});
				setIsLoading(false);
			});
		} catch (err) {
			console.log(err.message);
		}
	};

	const handleSelectedCity = ({ target: { value: id } }) => {
		setIsLoading(true);
		if (!!id) fetchData(id);
		else {
			dispatch({ type: ACTIONS.CLEAR_ELECTION });
			setIsLoading(false);
		}
	};

	return (
		<>
			<Header title="react-elections" cities={state.cities} onChange={handleSelectedCity} />
			<Container className="py-4">
				{isLoading && (
					<div className="text-center">
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</div>
				)}
				{!isLoading && !state.election && <div></div>}
				{!isLoading && state.election && <Election election={state.election} />}
			</Container>
		</>
	);
};

export default ElectionsPage;
