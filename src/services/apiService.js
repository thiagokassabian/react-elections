import { get } from './httpService';

const getCities = async () => await get('/cities');
const getCandidates = async () => await get('/candidates');
const getCandidate = async id => await get(`/candidates?id=${id}`);
const getElection = async cityId => await get(`/election?cityId=${cityId}`)

export { getCities, getCandidates, getElection, getCandidate };
