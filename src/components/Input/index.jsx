import Form from 'react-bootstrap/Form';
const Input = ({
	type = 'text',
	value = '',
	name = 'inputName',
	label = 'Label',
	id = 'inputId',
	placeholder = 'Placeholder',
	onChange = null,
}) => {
	const handleChange = event => {
		if (onChange) onChange(event);
	};

	return (
		<Form>
			<Form.Group className="mb-3" controlId={id}>
				<Form.Label>{label}</Form.Label>
				<Form.Control type={type} placeholder={placeholder} onChange={handleChange} />
			</Form.Group>
		</Form>
	);
};

export default Input;
