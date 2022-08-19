import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { useContext } from 'react';
import { GlobalContext } from '../../pages/ElectionsPage';
import map from 'lodash.map';

const Header = ({ title, selectedCity, onChange = null }) => {
	const { cities } = useContext(GlobalContext);

	const handleChangeCity = ({ target: { value: id } }) => {
		if (onChange) onChange(id);
	};

	return (
		<Navbar bg="dark" variant="dark">
			<Container>
				<Navbar.Brand>{title}</Navbar.Brand>
				<Nav className="ms-auto">
					<Form.Select aria-label="Selecione a cidade" onChange={handleChangeCity} value={selectedCity}>
						<option value="">Selecione a cidade</option>
						{map(cities, ({ id, name }) => (
							<option key={id} value={id}>
								{name}
							</option>
						))}
					</Form.Select>
				</Nav>
			</Container>
		</Navbar>
	);
};

export default Header;
