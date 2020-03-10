import React from 'react';
import {View, Text, ScrollView, Image, SafeAreaView} from '../shared/tailwind';
import {Link} from '../../earhart';
import {api} from '../../services/api';
import {usePlaylistContext} from '../../providers/playlist-provider';

function HomeFeed() {
  return (
    <View className="flex flex-1 bg-white">
      <SafeAreaView />
      <SettingsHeader />
      <ScrollView className="py-4 bg-white">
        <Playlists feedId="featured" title="Editors Picks" />
        <Playlists feedId="toplists" title="Top" />
        <Playlists feedId="workout" title="Workout" />
        <Playlists feedId="party" title="Party" />
      </ScrollView>
    </View>
  );
}

interface IPlaylists {
  feedId: string;
  title: string;
}

function Playlists({feedId, title}: IPlaylists) {
  const [state, dispatch] = usePlaylistContext();
  const [playlistIds, setPlaylistIds] = React.useState([]);

  React.useEffect(() => {
    api.get(`/playlists/${feedId}`).then(playlists => {
      dispatch({
        type: 'UPDATE_MANY',
        data: playlists,
      });

      setPlaylistIds(playlists.map(item => item.id));
    });
  }, []);

  const playlists = playlistIds.map(id => state.lookup[id]);

  return (
    <View className='py-3'>
      <Text className="px-4 text-3xl font-bold">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {playlists.map(playlist => {
          if (!playlist) {
            return null;
          }

          return (
            <View className="p-3" key={playlist.id}>
              <Link to={`profile/playlists/${playlist.id}`}>
                <Image
                  source={{uri: playlist.images[0].url}}
                  style={{height: 150, width: 150}}
                />

                <Text className="py-2 text-sm">{playlist.name}</Text>
              </Link>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function SettingsHeader() {
  return (
    <View className='py-4 px-3 flex-row'>
      <View className='flex-1' /> 
      <Link to={`settings`}>
        <Text className='text-2xl font-semibold text-right'>Settings</Text>
      </Link>
    </View>
  );
}

export {HomeFeed};
