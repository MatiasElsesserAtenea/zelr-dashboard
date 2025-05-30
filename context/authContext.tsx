import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { IUserProps } from '../common/data/userDummyData';

export interface IAuthContextProps {
	user: string;
	setUser?(...args: unknown[]): unknown;
	userData: Partial<IUserProps>;
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
	children: ReactNode;
}
export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
	// @ts-ignore
	const [user, setUser] = useState<string>(
		typeof window !== 'undefined' ? String(localStorage?.getItem('facit_authUsername')) : '',
	);
	const [userData, setUserData] = useState<Partial<IUserProps>>({
		id: 'asdasdas',
		username: 'Usuario',
		name: 'Test',
		surname: 'User',
		email: 'user@gmail.com',
	});

	useEffect(() => {
		localStorage.setItem('facit_authUsername', user);
	}, [user]);

	const value = useMemo(
		() => ({
			user,
			setUser,
			userData,
			setUserData,
		}),
		[user, userData],
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AuthContext;
