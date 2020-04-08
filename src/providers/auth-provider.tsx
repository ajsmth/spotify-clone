import React from 'react';
import {api} from '../services/api';
import {useUser} from './user-provider';

interface IAuthContext {
  authorized: boolean;
  loading: boolean;
  login: () => Promise<any>;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = React.createContext<IAuthContext | undefined>(undefined);

function AuthProvider({children}) {
  const [authorized, setAuthorized] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  function login(): Promise<any> {
    setLoading(true);

    return api
      .get('/auth/login')
      .then((creds) => {
        setAuthorized(true);
        setLoading(false);
      })
      .catch((error) => {
        setAuthorized(false);
        setLoading(false);
        return Promise.reject(error)
      });
  }

  function logout() {
    setLoading(true);
    api
      .get('/auth/logout')
      .then(() => {
        setAuthorized(false);
        setLoading(false);
      })
      .catch((error) => {
        setAuthorized(false);
        setLoading(false);
      });
  }

  function refresh() {
    api.get('/auth/refresh').then(console.log);
  }

  return (
    <AuthContext.Provider value={{login, logout, refresh, loading, authorized}}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error(`useAuth() must be used inside of an AuthContext`);
  }

  return context;
}

export {AuthProvider, useAuth};
