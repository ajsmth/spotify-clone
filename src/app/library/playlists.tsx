import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {Link} from '../../earhart';
import {styles} from '../../styles';
import {api} from '../../services/api';
import {usePlaylistContext} from '../../providers/playlist-provider';

function Playlists({to}) {
  const [state, dispatch] = usePlaylistContext();
  const [playlistIds, setPlaylistIds] = React.useState([]);

  React.useEffect(() => {
    api.get('/me/playlists').then(playlists => {
      dispatch({
        type: 'UPDATE_MANY',
        data: playlists,
      });

      setPlaylistIds(playlists.map(item => item.id));
    });
  }, [to]);

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 15}}>
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
    <Link
      to={to}
      style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
      <Image
        style={{width: 70, height: 70, marginRight: 10}}
        source={{uri: playlist.images[0]?.url}}
      />

      <View>
        <Text style={[styles.paragraph, styles.semibold]}>{playlist.name}</Text>
      </View>
    </Link>
  );
}

export {Playlists};
