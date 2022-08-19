import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../pages/ElectionsPage';
import map from 'lodash.map';
import Candidate from '../Candidate';
import Input from '../Input';
import './styles.scss';

const Election = () => {
	const [state] = useContext(GlobalContext);

	const { election } = state;
	const { name, votingPopulation, presence, absence } = election.city;

	const [searchCandidate, setSearchCandidate] = useState('');
	const [candidates, setCandidates] = useState(election.candidates);

	const handleFilterCandidate = ({ target: { value } }) => {
		setSearchCandidate(value);
		const filteredElection = election.candidates.filter(c =>
			c.candidateName.toLowerCase().includes(value.toLowerCase())
		);
		setCandidates(filteredElection);
	};

	return (
		<>
			<h2 className="display-5 text-center text-md-start">Eleição em {name}</h2>
			<ul className="list-unstyled d-flex flex-column gap-md-3 flex-md-row align-items-center justify-content-md-start">
				<li>
					<strong>Total de eleitores:</strong> {votingPopulation.toLocaleString('pt-BR')}
				</li>
				<li>
					<strong>Comparecimento:</strong> {presence.toLocaleString('pt-BR')}
				</li>
				<li>
					<strong>Abstenções:</strong> {absence.toLocaleString('pt-BR')}
				</li>
			</ul>
			<div className="d-flex mb-3">
				<div>
					<Input
						type="search"
						value={searchCandidate}
						name="searchCandidate"
						label="Filtrar candidato"
						placeholder=""
						onChange={handleFilterCandidate}
					/>
				</div>
				<div className="ms-auto align-self-end">{candidates.length} candidatos</div>
			</div>
			<div className="row">
				{map(candidates, candidate => (
					<div
						className="col-6 col-md-4 col-xl-3 d-flex align-items-stretch mb-3"
						key={candidate.candidateId}>
						<Candidate data={candidate} />
					</div>
				))}
			</div>
		</>
	);
};

export default Election;
