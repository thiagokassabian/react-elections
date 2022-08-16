import Candidate from '../Candidate';
import './styles.scss';

const Election = ({ election, selectedCity: city, candidates }) => {
	const { name, votingPopulation, presence, absence } = city;

	return (
		<>
			<h2>Eleição em {name}</h2>
			<ul className="list-inline">
				<li className="list-inline-item">
					<strong>Total de eleitores:</strong> {votingPopulation.toLocaleString('pt-BR')}
				</li>
				<li className="list-inline-item">
					<strong>Abstenções:</strong> {absence.toLocaleString('pt-BR')}
				</li>
				<li className="list-inline-item">
					<strong>Comparecimento:</strong> {presence.toLocaleString('pt-BR')}
				</li>
			</ul>
			<p>{election.length} candidatos</p>
			<div className="row">
				{election
					.sort((a, b) => b.votes - a.votes)
					.map((candidate, i) => (
						<div
							className="col-6 col-md-4 col-lg-3 col-xl-2 d-flex align-items-stretch mb-3"
							key={candidate.candidateId}>
							<Candidate
								data={{
									...candidate,
									candidate: candidates.find(c => c.id === candidate.candidateId),
									percentage: ((candidate.votes * 100) / city.presence).toFixed(2),
									elected: i === 0 ? true : false,
								}}
							/>
						</div>
					))}
			</div>
		</>
	);
};

export default Election;
