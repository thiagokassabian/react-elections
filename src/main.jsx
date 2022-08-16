import React from 'react';
import ReactDOM from 'react-dom/client';
import ElectionsPage from './pages/ElectionsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ElectionsPage />
	</React.StrictMode>
);
