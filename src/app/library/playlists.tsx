import React from 'react';
import {View, Text, ScrollView, Image} from '../shared/tailwind';
import {Link, useFocusLazy} from '../../earhart';
import {api} from '../../services/api';
import {usePlaylists, useCollections} from '../../providers/spotify-providers';

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

const PLAYLISTS_COLLECTION_ID = 'library-playlists';

function useLibraryPlaylists() {
  const lookup = usePlaylists((state) => state.lookup);
  const update = usePlaylists((state) => state.update);

  const add = useCollections((state) => state.update);

  const focused = useFocusLazy();

  React.useEffect(() => {
    if (focused) {
      api.get('/playlists/me').then((playlists) => {
        update(playlists);

        const collection = {
          id: PLAYLISTS_COLLECTION_ID,
          ids: playlists.map((p) => p.id),
        };

        add([collection]);
      });
    }
  }, [focused]);

  const playlistIds = useCollections(
    (state) => state.lookup[PLAYLISTS_COLLECTION_ID]?.ids || [],
  );
  
  return playlistIds.map((id) => lookup[id]);
}

export {Playlists};
