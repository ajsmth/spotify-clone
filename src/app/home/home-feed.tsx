import React from 'react';
import {View, Text, ScrollView, SafeAreaView, Image} from 'react-native';
import {Link} from '../../earhart';
import {styles} from '../../styles';
import {api} from '../../services/api';
import {usePlaylistContext} from '../../providers/playlist-provider';

function HomeFeed() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <SettingsHeader />
      <ScrollView style={{flex: 1}}>
        <Playlists feedId="featured" title="Editors Picks" />
        <Playlists feedId="toplists" title="Top" />
        <Playlists feedId="workout" title="Workout" />
        <Playlists feedId="party" title="Party" />
      </ScrollView>
    </SafeAreaView>
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
    api.get(`/home/playlists/${feedId}`).then(playlists => {
      dispatch({
        type: 'UPDATE_MANY',
        data: playlists,
      });

      setPlaylistIds(playlists.map(item => item.id));
    });
  }, []);

  const playlists = playlistIds.map(id => state.lookup[id]);

  return (
    <View>
      <Text style={[styles.h4, {margin: 15, fontWeight: 'bold'}]}>{title}</Text>
      <View style={{height: 200, justifyContent: 'center'}}>
        <ScrollView
          style={{flex: 1}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {playlists.map(playlist => {
            if (!playlist) {
              return null;
            }

            return (
              <Link
                key={playlist.id}
                to={`profile/playlists/${playlist.id}`}
                style={{padding: 15}}>
                <Image
                  source={{uri: playlist.images[0].url}}
                  style={{height: 150, width: 150}}
                />

                <Text style={[styles.paragraph, {fontWeight: '500'}]}>
                  {playlist.name}
                </Text>
              </Link>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

function SettingsHeader() {
  return (
    <View
      style={{
        height: 60,
        justifyContent: 'center',
        paddingHorizontal: 10,
      }}>
      <Link to={`settings`}>
        <Text style={[styles.title, {textAlign: 'right'}]}>Settings</Text>
      </Link>
    </View>
  );
}

export {HomeFeed};
