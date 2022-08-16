import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import './styles.scss';

const Candidate = ({ data, className }) => {
	const { votes, percentage, elected } = data;
	const { name } = data.candidate;
	const isElected = elected ? 'bg-success text-white' : '';

	return (
		<Card className="flex-grow-1">
			<Card.Img variant="top" src={`../assets/img/${name}.png`} />
			<Card.Body>
				<Card.Title>{name}</Card.Title>
				<Card.Text>
					{votes.toLocaleString('pt-BR')} ({percentage}%)
				</Card.Text>
				{isElected && (
					<Alert variant="success" className="text-center mb-0 p-2">
						Eleito
					</Alert>
				)}
			</Card.Body>
		</Card>
	);
};

export default Candidate;
