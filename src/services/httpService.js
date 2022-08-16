import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

const axiosInstance = axios.create({ baseURL: BASE_URL });

const get = async url => {
	const { data } = await axiosInstance.get(url);
	return data;
};

export { get };
