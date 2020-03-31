import React from 'react';

interface IUserContext {
  user: IUser | undefined;
  setUser: (user: IUser | undefined) => void;
}

const UserContext = React.createContext<IUserContext>({
  user: undefined,
  setUser: () => {},
});

interface IUserProvider {
  children: React.ReactNode;
}

function UserProvider({children}: IUserProvider) {
  const [user, setUser] = React.useState<IUser | undefined>(undefined);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}

function useUser(): IUserContext {
  const context = React.useContext(UserContext);
  return context
}

export {useUser, UserProvider};
