import React from 'react';
import {View, Text, ScrollView, Image} from '../shared/tailwind';
import {Link, useFocusLazy} from '../../earhart';
import {api} from '../../services/api';
import {useArtists, useCollections} from '../../providers/spotify-providers';

function Artists({to}) {
  const artists = useLibraryArtists();
  return (
    <ScrollView className="p-4 flex-1 bg-white">
      {artists.map((artist) => {
        return (
          <ArtistRow
            key={artist.id}
            to={`${to}/${artist.id}`}
            artist={artist}
          />
        );
      })}
    </ScrollView>
  );
}

interface IArtistRow {
  artist: IArtist;
  to: string;
}

function ArtistRow({artist, to}: IArtistRow) {
  return (
    <Link to={to}>
      <View className="flex-row items-center my-3">
        <Image
          className="w-16 h-16 mr-4 bg-gray-900"
          source={{uri: artist.images[0].url}}
        />
        <View className="items-start">
          <Text className="font-semibold text-xl w-full">{artist.name}</Text>
        </View>
      </View>
    </Link>
  );
}

const ARTIST_COLLECTION_ID = 'library-artists';

function useLibraryArtists() {
  const lookup = useArtists((state) => state.lookup);
  const update = useArtists((state) => state.update);

  const add = useCollections((state) => state.update);

  const focused = useFocusLazy();

  React.useEffect(() => {
    if (focused) {
      api.get('/artists/me').then((artists) => {
        update(artists);

        const collection = {
          id: ARTIST_COLLECTION_ID,
          ids: artists.map((a) => a.id),
        };

        add([collection]);
      });
    }
  }, [focused]);

  const artistIds = useCollections(
    (state) => state.lookup[ARTIST_COLLECTION_ID]?.ids || [],
  );
  
  return artistIds.map((id) => lookup[id]);
}

export {Artists};
