import React from 'react';

const UserContext = React.createContext<IUser | undefined>(undefined);

interface IUserProvider {
  children: React.ReactNode;
  user: IUser;
}
function UserProvider({user, children}: IUserProvider) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

function useUser(): IUser {
  const context = React.useContext(UserContext);
  return context as IUser;
}

export {useUser, UserProvider};
