import React from 'react';
import {api} from '../../services/api';
import {useCategoryContext} from '../../providers/category-provider';
import {SafeAreaView, ScrollView, View, Text, Image} from '../shared/tailwind';
import {ImageBackground} from 'react-native';
import {SharedElement, SharedElements} from 'earhart-shared-element';
import {Routes, Route, useParams, Link, Stack} from 'earhart';
import {usePlaylistContext} from '../../providers/playlist-provider';
import {Playlist} from '../profiles/playlist';
import {PerformantScreen} from '../shared/performant-screen';

function Search() {
  return (
    <Stack>
      <Routes>
        <Route path="/">
          <Index />
        </Route>

        <Route path="category/:categoryId">
          <Category />
        </Route>

        <Route path="category/:categoryId/:id">
          <Playlist backUrl="../" />
        </Route>
      </Routes>
    </Stack>
  );
}

function usePlaylists(categoryId: string) {
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

function Category() {
  const params = useParams();
  const [state] = useCategoryContext();

  const category = state.lookup[params.categoryId];
  const playlists = usePlaylists(params.categoryId);

  if (!category) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-4xl font-extrabold">{category.name}</Text>
        </View>

        <PerformantScreen>
          <View className="flex-1 flex-wrap flex-row p-2">
            {playlists.map(playlist => {
              return (
                <View key={playlist.id} className="w-1/3 p-2">
                  <Link to={`${playlist.id}`}>
                    <Image
                      className="w-full"
                      style={{aspectRatio: 1}}
                      source={{uri: playlist.images[0]?.url}}
                    />
                  </Link>
                </View>
              );
            })}
          </View>
        </PerformantScreen>
      </ScrollView>
    </SafeAreaView>
  );
}

function Index() {
  const [state, dispatch] = useCategoryContext();

  React.useEffect(() => {
    api.get(`/categories`).then(categories => {
      dispatch({
        type: 'UPDATE_MANY',
        data: categories,
      });
    });
  }, []);

  const categories = state.ids.map(id => state.lookup[id]);

  const top = categories.slice(0, 4);
  const all = categories.slice(4);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 p-4">
        <View className="mb-2">
          <Text className="text-4xl font-extrabold">Search</Text>
        </View>

        <View className="my-2">
          <Text className="text-lg font-semibold">Your top genres</Text>
        </View>

        <View className="flex-wrap flex-row -mx-2">
          {top.map(category => {
            return <CategoryItem key={category.id} category={category} />;
          })}
        </View>

        <View className="my-2">
          <Text className="text-lg font-semibold">Browse all</Text>
        </View>

        <PerformantScreen>
          <View className="flex-wrap flex-row -mx-2">
            {all.map(category => {
              return <CategoryItem key={category.id} category={category} />;
            })}
          </View>
        </PerformantScreen>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ICategoryItem {
  category: ICategory;
}

function CategoryItem({category}: ICategoryItem) {
  return (
    <View className="my-1 w-1/3 h-32 items-center">
      <Link to={`category/${category.id}`}>
        <View className="h-32 w-32 border pb-3">
          <View className="flex-1">
            <Image
              className="h-32 w-32"
              source={{uri: category.icons[0]?.url}}
            />
            <Text className="absolute bottom-0 left-0 right-0 text-center text-base font-semibold text-white">
              {category.name}
            </Text>
          </View>
        </View>
      </Link>
    </View>
  );
}

export {Search};
