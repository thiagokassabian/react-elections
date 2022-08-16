import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

const Header = ({ title, cities, onChange = null }) => {
	const handleChangeCity = event => {
		if (onChange) onChange(event);
	};

	return (
		<>
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand href="#home">{title}</Navbar.Brand>
					<Nav className="ms-auto">
						<Form.Select aria-label="Selecione a cidade" onChange={handleChangeCity}>
							<option value="">Selecione a cidade</option>
							{cities?.map(({ id, name }) => (
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
