import React from 'react';
import {View, Text, ScrollView, Image} from '../shared/tailwind';
import {Link, useFocusLazy} from '../../earhart';
import {api} from '../../services/api';
import {useAlbums, useCollections} from '../../providers/spotify-providers';

function Albums({to}) {
  const albums = useLibraryAlbums();

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {albums.map((album) => {
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
        <Image
          className="w-16 h-16 mr-4 bg-gray-900"
          source={{uri: album.images[0].url}}
        />
        <View className="items-start">
          <Text className="font-semibold text-xl w-full">{album.name}</Text>
          <Text className="mt-1 text-sm text-gray-700">
            {album.artists[0]?.name}
          </Text>
        </View>
      </View>
    </Link>
  );
}

const ALBUM_COLLECTION_ID = 'library-albums';

function useLibraryAlbums() {
  const lookup = useAlbums((state) => state.lookup);
  const update = useAlbums((state) => state.update);

  const add = useCollections((state) => state.update);

  const focused = useFocusLazy();

  React.useEffect(() => {
    if (focused) {
      api.get('/albums/me').then((albums) => {
        update(albums);

        const collection = {
          id: ALBUM_COLLECTION_ID,
          ids: albums.map((a) => a.id),
        };

        add([collection]);
      });
    }
  }, [focused]);

  const albumIds = useCollections(
    (state) => state.lookup[ALBUM_COLLECTION_ID]?.ids || [],
  );
  return albumIds.map((id) => lookup[id]);
}

export {Albums};
