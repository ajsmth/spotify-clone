import React from 'react';
import {Link, useNavigator} from '../../earhart';
import {api} from '../../services/api';
import {useCategoryContext} from '../../providers/category-provider';
import {SafeAreaView, ScrollView, View, Image} from '../shared/tailwind';
import {usePlaylistContext} from '../../providers/playlist-provider';

function Category() {
  const {params} = useNavigator();
  const [state] = useCategoryContext();

  const category = state.lookup[params.categoryId];
  const playlists = useCategoryPlaylists(params.categoryId);

  if (!category) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 flex-wrap flex-row p-2">
          {playlists.map(playlist => {
            return (
              <View key={playlist.id} className="w-1/3 p-2">
                <Link to={`/search/${params.categoryId}/${playlist.id}`}>
                  <Image
                    className="w-full bg-gray-300"
                    style={{aspectRatio: 1}}
                    source={{uri: playlist.images[0]?.url}}
                  />
                </Link>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function useCategoryPlaylists(categoryId: string) {
  const [state, dispatch] = usePlaylistContext();

  const [playlistIds, setPlaylistIds] = React.useState([]);

  React.useEffect(() => {
    if (categoryId) {
      api.get(`/playlists/${categoryId}`).then(playlists => {
        dispatch({
          type: 'UPDATE_MANY',
          data: playlists,
        });

        setPlaylistIds(playlists.map(playlist => playlist.id));
      });
    }
  }, [categoryId]);

  return playlistIds.map(id => state.lookup[id]);
}

export {Category};
