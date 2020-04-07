import React from 'react';
import {Link, useParams} from '../../earhart';
import {api} from '../../services/api';
import {SafeAreaView, ScrollView, View, Image} from '../shared/tailwind';
import {
  usePlaylists,
  useCategories,
  useCollections,
} from '../../providers/spotify-providers';

function Category() {
  const params = useParams<{categoryId: string}>();
  const lookup = useCategories((state) => state.lookup);

  const category = lookup[params.categoryId || ''];
  const playlists = useCategoryPlaylists(params.categoryId || '');

  if (!category) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 flex-wrap flex-row p-2">
          {playlists.map((playlist) => {
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
  const lookup = usePlaylists((state) => state.lookup);
  const update = usePlaylists((state) => state.update);

  const add = useCollections((state) => state.update);

  React.useEffect(() => {
    if (categoryId) {
      api.get(`/playlists/${categoryId}`).then((playlists) => {
        update(playlists);

        const collection = {
          id: categoryId,
          ids: playlists.map((p) => p.id),
        };

        add([collection]);
      });
    }
  }, [categoryId]);

  const playlistIds = useCollections(
    (state) => state.lookup[categoryId]?.ids || [],
  );
  return playlistIds.map((id) => lookup[id]);
}

export {Category};
