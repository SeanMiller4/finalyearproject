import { createContext, useState, useContext } from 'react';

const AuthorisationContext = createContext({
	currentUser: null,
	login: () => { },
	logout: () => { }
});

export function AuthorisationProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(() => {
		if (typeof window === 'undefined') return null;
		const stored = localStorage.getItem('currentUser');
		return stored ? JSON.parse(stored) : null;
	});

	function login(user) {
		localStorage.setItem('currentUser', JSON.stringify(user));
		setCurrentUser(user);
	}
	function logout() {
		localStorage.removeItem('currentUser');
		setCurrentUser(null);
	}

	return (
		<AuthorisationContext.Provider value={{ currentUser, login, logout }}>
			{children}
		</AuthorisationContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthorisationContext);
}