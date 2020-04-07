import create from 'zustand';

interface IUserStore {
  user: IUser | null;
  update: (user: IUser | null) => void;
}

const [useUser, user] = create<IUserStore>((set) => {
  return {
    user: null,
    update: (user: IUser | null) => set({user}),
  };
});

export { useUser, user }
