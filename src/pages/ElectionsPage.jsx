import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Election from '../components/Election';
import Header from '../components/Header';
import { getCandidate, getCandidates, getCities, getElection } from '../services/apiService';
import Spinner from 'react-bootstrap/Spinner';

const ElectionsPage = () => {
	const [cities, setCities] = useState(null);
	const [selectedCity, setSelectedCity] = useState(null);
	const [candidates, setCandidates] = useState(null);
	const [election, setElection] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const citiesFromServer = await getCities();
			const candidatesFromServer = await getCandidates();
			setCandidates(candidatesFromServer);
			setCities(citiesFromServer);
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (selectedCity) {
			const fetchData = async () => {
				try {
					const electionFromServer = await getElection(selectedCity.id);
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
			fetchData();
		} else {
			setElection(null);
		}
	}, [selectedCity]);

	const handleSelectedCity = ({ target: { value: id } }) => {
		setSelectedCity(null);
		setCandidates(null);
		setElection(null);
		setIsLoading(true);
		if (!!id) setSelectedCity(cities.find(city => city.id === id));
		else setIsLoading(false);
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
				{!selectedCity && <div>Selecione uma cidade</div>}
				{!isLoading && selectedCity && (
					<Election selectedCity={selectedCity} election={election} candidates={candidates} />
				)}
			</Container>
		</>
	);
};

export default ElectionsPage;
