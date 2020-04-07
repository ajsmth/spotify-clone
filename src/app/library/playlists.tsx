import React from 'react';
import {View, Text, ScrollView, Image} from '../shared/tailwind';
import {Link, useFocusLazy} from '../../earhart';
import {api} from '../../services/api';
import {usePlaylists} from '../../providers/spotify-providers';

function Playlists({to}) {
  const playlists = useLibraryPlaylists();

  return (
    <ScrollView className="p-4 flex-1 bg-white">
      {playlists.map((playlist) => {
        return (
          <PlaylistRow
            key={playlist.id}
            to={`${to}/${playlist.id}`}
            playlist={playlist}
          />
        );
      })}
    </ScrollView>
  );
}

interface IPlaylistRow {
  to: string;
  playlist: IPlaylist;
}

function PlaylistRow({playlist, to}: IPlaylistRow) {
  return (
    <View className="my-3">
      <Link to={to}>
        <View className="flex-row items-center">
          <Image
            className="w-16 h-16 mr-3"
            source={{uri: playlist.images[0]?.url}}
          />

          <Text className="text-base font-semibold">{playlist.name}</Text>
        </View>
      </Link>
    </View>
  );
}

function useLibraryPlaylists() {
  const lookup = usePlaylists((state) => state.lookup);
  const update = usePlaylists((state) => state.update);

  const [playlistIds, setPlaylistIds] = React.useState([]);

  const focused = useFocusLazy();

  React.useEffect(() => {
    if (focused) {
      api.get('/playlists/me').then((playlists) => {
        const playlistIds = playlists.filter(Boolean).map((p) => p.id);
        update(playlists);
        setPlaylistIds(playlistIds);
      });
    }
  }, [focused]);

  return playlistIds.map((id) => lookup[id]);
}

export {Playlists};
