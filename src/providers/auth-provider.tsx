import React from 'react';
import {ActivityIndicator} from 'react-native';
import {useNavigate} from '../earhart';
import {api} from '../services/api';

interface IAuthContext {
  user?: IUser;
  setUser: (user: IUser) => void;
  login: () => void;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = React.createContext<IAuthContext | undefined>(undefined);

function AuthProvider({children}) {
  const [user, setUser] = React.useState<IUser | undefined>(undefined);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);

    api.get('/me')
      .then((user: IUser) => {
        setUser(user);
        setLoading(false);
      })
      .catch(error => {
        console.log({error});
        setLoading(false);
        setUser(undefined);
      });
  }, []);

  function login() {
    setLoading(true);

    return api
      .get('/auth/login')
      .then(() => {
        return api.get(`/me`).then((user: IUser) => {
          setUser(user);
          setLoading(false);
          return user;
        });
      })
      .catch(error => {
        setUser(undefined);
        setLoading(false);
      });
  }

  function logout() {
    setLoading(true);

    api
      .get('/auth/logout')
      .then(() => {
        setUser(undefined);
        setLoading(false);
        navigate('/auth/login', {replace: true});
      })
      .catch(error => {
        setUser(undefined);
        setLoading(false);
        navigate('/auth/login', {replace: true});
      });
  }

  function refresh() {
    api.get('/auth/refresh').then(console.log);
  }

  return (
    <AuthContext.Provider value={{user, setUser, login, logout, refresh}}>
      {loading ? <ActivityIndicator /> : children({user})}
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
