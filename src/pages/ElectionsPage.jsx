import { useEffect, useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import Election from '../components/Election';
import Header from '../components/Header';
import find from 'lodash.find';
import { ElectionsContext } from '../contexts/ElectionsProvider/context';
import './styles.scss';
import { getCities, getElection } from '../contexts/ElectionsProvider/actions';

const ElectionsPage = () => {
	const { electionsState, electionsDispatch } = useContext(ElectionsContext);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		getCities(electionsDispatch).then(dispatch => {
			dispatch();
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		if (electionsState.selectedCityId) {
			setIsLoading(true);
			const city = find(electionsState.cities, { id: electionsState.selectedCityId });
			getElection(electionsDispatch, city).then(dispatch => {
				dispatch();
				setIsLoading(false);
			});
		}
	}, [electionsState.selectedCityId]);

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
				{!isLoading && electionsState.election && <Election />}
			</Container>
		</>
	);
};

export default ElectionsPage;
