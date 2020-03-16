import React from 'react';
import {View, Text, ScrollView, Image} from '../shared/tailwind';
import {Link} from 'earhart';
import {useAlbumContext} from '../../providers/album-provider';
import {api} from '../../services/api';
import {SharedElement} from 'earhart-shared-element';

function Albums({to}) {
  const [state, dispatch] = useAlbumContext();
  const [albumIds, setAlbumIds] = React.useState([]);

  React.useEffect(() => {
    api.get('/albums/me').then(albums => {
      dispatch({
        type: 'UPDATE_MANY',
        data: albums,
      });

      setAlbumIds(albums.map(album => album.id));
    });
  }, []);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {albumIds.map(id => {
        const album = state.lookup[id];

        return (
          <AlbumRow key={album.id} to={`${to}/${album.id}`} album={album} />
        );
      })}
    </ScrollView>
  );
}

interface IAlbumRow {
  album: IAlbum;
  to: string;
}

function AlbumRow({album, to}: IAlbumRow) {
  return (
    <Link to={to}>
      <View className="flex-row items-center my-3">
        <SharedElement id={`album-profile-image-${album.id}`}>
          <Image
            className="w-16 h-16 mr-4 bg-gray-900"
            source={{uri: album.images[0].url}}
          />
        </SharedElement>
        <View className="items-start">
          <SharedElement id={`album-profile-name-${album.id}`}>
            <Text className="font-semibold text-xl w-full">{album.name}</Text>
          </SharedElement>
          <SharedElement id={`album-profile-artist-${album.id}`}>
            <Text className="mt-1 text-sm text-gray-700">
              {album.artists[0]?.name}
            </Text>
          </SharedElement>
        </View>
      </View>
    </Link>
  );
}

export {Albums};
