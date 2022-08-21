import { useReducer } from 'react';
import { ElectionsContext } from './context';
import { reducer } from './reducer';

export const ElectionsProvider = ({ children }) => {
	const [electionsState, electionsDispatch] = useReducer(reducer, {});

	return (
		<ElectionsContext.Provider value={{ electionsState, electionsDispatch }}>{children}</ElectionsContext.Provider>
	);
};
