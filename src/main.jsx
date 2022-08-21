import React from 'react';
import ReactDOM from 'react-dom/client';
import ElectionsPage from './pages/ElectionsPage';
import { ElectionsProvider } from './contexts/ElectionsProvider';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ElectionsProvider>
			<ElectionsPage />
		</ElectionsProvider>
	</React.StrictMode>
);
