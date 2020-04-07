import React from 'react';
import {Stack, Route, Navigator, Header} from '../../earhart';
import {Playlist} from '../profiles/playlist';
import {Categories} from './categories';
import {Category} from './category';
import {usePlaylists} from '../../providers/spotify-providers';

function Search() {
  const lookup = usePlaylists((state) => state.lookup);

  return (
    <StackNavigator>
      <Route path="/search">
        <Header title="Search" largeTitle />
        <Categories />
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
          title={({params}) => lookup[params.id]?.name || ''}
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

export {Search};

function capitalize(str: string = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
