import { createContext, useReducer } from 'react';
import { reducer } from './ElectionsReducers';

export const ElectionsContext = createContext();

export const AppContext = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, {});

	return <ElectionsContext.Provider value={{ state, dispatch }}>{children}</ElectionsContext.Provider>;
};
