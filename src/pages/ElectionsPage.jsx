import { useEffect, useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { getCandidate, getCities, getElection } from '../services/apiService';
import Election from '../components/Election';
import Header from '../components/Header';
import orderBy from 'lodash.orderby';
import find from 'lodash.find';
import { ACTIONS } from '../context/ElectionsActions';
import { ElectionsContext } from '../context/ElectionsContext';
import './styles.scss';

const ElectionsPage = () => {
	const { state, dispatch } = useContext(ElectionsContext);
	const [isLoading, setIsLoading] = useState(false);

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
		<>
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
		</>
	);
};

export default ElectionsPage;
