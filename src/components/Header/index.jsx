import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { useContext } from 'react';
import map from 'lodash.map';
import { ElectionsContext } from '../../contexts/ElectionsProvider/context';
import { changeCity } from '../../contexts/ElectionsProvider/actions';

const Header = ({ title }) => {
	const {
		electionsState: { cities, selectedCityId },
		electionsDispatch,
	} = useContext(ElectionsContext);

	const handleChangeCity = ({ target: { value: id } }) => {
		changeCity(electionsDispatch, id);
	};

	return (
		<>
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand>{title}</Navbar.Brand>
					<Nav className="ms-auto">
						<Form.Select aria-label="Selecione a cidade" onChange={handleChangeCity} value={selectedCityId}>
							{/* <option value="">Selecione a cidade</option> */}
							{map(cities, ({ id, name }) => (
								<option key={id} value={id}>
									{name}
								</option>
							))}
						</Form.Select>
					</Nav>
				</Container>
			</Navbar>
		</>
	);
};

export default Header;
