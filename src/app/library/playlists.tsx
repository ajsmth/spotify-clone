import React from 'react';
import {View, Text, ScrollView, Image} from '../shared/tailwind';
import {Link} from '../../earhart';
import {api} from '../../services/api';
import {usePlaylistContext} from '../../providers/playlist-provider';

function Playlists({to}) {
  const [state, dispatch] = usePlaylistContext();
  const [playlistIds, setPlaylistIds] = React.useState([]);

  React.useEffect(() => {
    api.get('/playlists/me').then(playlists => {
      dispatch({
        type: 'UPDATE_MANY',
        data: playlists,
      });

      setPlaylistIds(playlists.map(item => item.id));
    });
  }, [to]);

  return (
    <ScrollView className="p-4 flex-1 bg-white">
      {playlistIds.map(id => {
        const playlist = state.lookup[id];

        if (!playlist) {
          return null;
        }

        return <PlaylistRow key={id} to={`${to}/${id}`} playlist={playlist} />;
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

export {Playlists};
