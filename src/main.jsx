import React from 'react';
import ReactDOM from 'react-dom/client';
import ElectionsPage from './pages/ElectionsPage';
import './index.scss';
import { AppContext } from './context/ElectionsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AppContext>
			<ElectionsPage />
		</AppContext>
	</React.StrictMode>
);
