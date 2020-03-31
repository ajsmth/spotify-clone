import React from 'react';
import {api} from '../../services/api';
import {useCategoryContext} from '../../providers/category-provider';
import {SafeAreaView, ScrollView, View, Text, Image} from '../shared/tailwind';
import {
  Stack,
  Route,
  Link,
  Navigator,
  useNavigator,
  Header,
  INavigatorState,
} from '../../earhart';
import {usePlaylistContext} from '../../providers/playlist-provider';
import {Playlist} from '../profiles/playlist';

function Search() {
  const [state] = usePlaylistContext();

  return (
    <StackNavigator>
      <Route path="/search">
        <Header title="Search" largeTitle />
        <Index />
      </Route>

      <Route path="/search/:categoryId">
        <Header
          title={({params}) => `${capitalize(params.categoryId)}`}
          largeTitle
        />
        <Category />
      </Route>

      <Route path="/search/:categoryId/:id">
        <Header
          title={({params}) => state.lookup[params.id]?.name || ''}
          largeTitle
        />
        <Playlist />
      </Route>
    </StackNavigator>
  );
}

function StackNavigator({children}) {
  return (
    <Navigator>
      <Stack>{children}</Stack>
    </Navigator>
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
      <ScrollView className="flex-1 px-4 bg-white">
        <View className="py-2">
          <Text className="text-lg font-semibold">Your top genres</Text>
        </View>

        <View className="flex-wrap flex-row">
          {top.map(category => {
            return <CategoryItem key={category.id} category={category} />;
          })}
        </View>

        <View className="my-2">
          <Text className="text-lg font-semibold">Browse all</Text>
        </View>

        <View className="flex-wrap flex-row">
          {all.map(category => {
            return <CategoryItem key={category.id} category={category} />;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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

interface ICategoryItem {
  category: ICategory;
}

function CategoryItem({category}: ICategoryItem) {
  return (
    <View className="w-1/3 h-full p-1" style={{aspectRatio: 1}}>
      <Link to={`/search/${category.id}`}>
        <View className="w-full h-full">
          <Image
            className="w-full h-full"
            source={{uri: category.icons[0]?.url}}
          />
          <View className="pb-2 absolute bottom-0 left-0 right-0">
            <Text className="text-center text-base font-semibold text-white">
              {category.name}
            </Text>
          </View>
        </View>
      </Link>
    </View>
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

export {Search};

function capitalize(str: string = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
