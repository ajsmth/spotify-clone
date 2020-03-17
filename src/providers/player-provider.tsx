import React from 'react';

const PlayerTrackIdContext = React.createContext('');

type SetTrackId = React.Dispatch<React.SetStateAction<string>>;

const PlayerSetTrackIdContext = React.createContext<SetTrackId>(() => {});

function PlayerProvider({children}) {
  const [trackId, setTrackId] = React.useState('');

  return (
    <PlayerTrackIdContext.Provider value={trackId}>
      <PlayerSetTrackIdContext.Provider value={setTrackId}>
        {children}
      </PlayerSetTrackIdContext.Provider>
    </PlayerTrackIdContext.Provider>
  );
}

function useTrackId() {
  return React.useContext(PlayerTrackIdContext);
}

function useSetTrackId() {
  return React.useContext(PlayerSetTrackIdContext);
}

export {PlayerProvider, useTrackId, useSetTrackId};
