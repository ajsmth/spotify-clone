import React from 'react';
import {View, Text, ScrollView, Image} from '../shared/tailwind';
import {Link, useFocusLazy} from '../../earhart';
import {useArtistContext} from '../../providers/artist-provider';
import {api} from '../../services/api';

function Artists({to}) {
  const artists = useArtists();
  return (
    <ScrollView className="p-4 flex-1 bg-white">
      {artists.map(artist => {
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

function useArtists() {
  const [state, dispatch] = useArtistContext();
  const [artistIds, setArtistIds] = React.useState([]);
  const focused = useFocusLazy();

  React.useEffect(() => {
    if (focused) {
      api.get('/artists/me').then(artists => {
        dispatch({
          type: 'UPDATE_MANY',
          data: artists,
        });

        setArtistIds(artists.map(item => item.id));
      });
    }
  }, [focused]);

  const artists = artistIds.map(id => state.lookup[id]);
  return artists;
}

export {Artists};
