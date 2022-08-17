import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { getCandidate, getCities, getElection } from '../services/apiService';
import Election from '../components/Election';
import Header from '../components/Header';

const ElectionsPage = () => {
	const [cities, setCities] = useState(null);
	const [selectedCity, setSelectedCity] = useState(null);
	const [candidates, setCandidates] = useState(null);
	const [election, setElection] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchCitiesData = async () => {
			const citiesFromServer = await getCities();
			setCities(citiesFromServer);
		};
		fetchCitiesData();
	}, []);

	const fetchData = async id => {
		try {
			const electionFromServer = await getElection(id);
			const candidatesFromServer = Promise.all(
				electionFromServer.map(async candidate => {
					const response = await getCandidate(candidate.candidateId);
					return response[0];
				})
			);
			candidatesFromServer.then(response => {
				setCandidates(response);
				setElection(electionFromServer);
				setIsLoading(false);
			});
		} catch (err) {
			console.log(err.message);
		}
	};

	const handleSelectedCity = ({ target: { value: id } }) => {
		setSelectedCity(null);
		setCandidates(null);
		setElection(null);
		setIsLoading(true);
		if (!!id) {
			const city = cities.find(city => city.id === id);
			setSelectedCity(city);
			fetchData(id);
		} else setIsLoading(false);
	};

	return (
		<>
			<Header title="react-elections" cities={cities} onChange={handleSelectedCity} />
			<Container className="py-4">
				{isLoading && (
					<div className="text-center">
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</div>
				)}
				{!selectedCity && <div></div>}
				{!isLoading && selectedCity && (
					<Election selectedCity={selectedCity} election={election} candidates={candidates} />
				)}
			</Container>
		</>
	);
};

export default ElectionsPage;
