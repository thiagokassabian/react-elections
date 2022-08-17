import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import './styles.scss';

const Candidate = ({ data }) => {
	const { votes, percentage, elected } = data;
	const { name } = data.candidate;

	return (
		<Card className="flex-grow-1">
			<Card.Img variant="top" src={`../assets/img/${name}.png`} />
			<Card.Body>
				<Card.Title className="d-flex flex-wrap gap-2">
					{name}
					{elected && (
						<Badge pill bg="success">
							Eleito
						</Badge>
					)}
				</Card.Title>
				<Card.Text>
					{votes.toLocaleString('pt-BR')} ({percentage}%)
				</Card.Text>
				{/* {elected && (
					<Alert variant="success" className="text-center mb-0 p-2">
						Eleito
					</Alert>
				)} */}
			</Card.Body>
		</Card>
	);
};

export default Candidate;
