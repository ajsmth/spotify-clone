import React from 'react';
import {View, Text, ScrollView, Image} from '../shared/tailwind';
import {Link} from 'earhart';
import {useArtistContext} from '../../providers/artist-provider';
import {api} from '../../services/api';

function Artists({to}) {
  const [state, dispatch] = useArtistContext();
  const [artistIds, setArtistIds] = React.useState([]);

  React.useEffect(() => {
    api.get('/me/artists').then(artists => {
      dispatch({
        type: 'UPDATE_MANY',
        data: artists,
      });

      setArtistIds(artists.map(item => item.id));
    });
  }, []);

  return (
    <ScrollView className="p-4 flex-1 bg-white">
      {artistIds.map(id => {
        const artist = state.lookup[id];
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
          className="w-20 h-20 rounded-full mr-4"
          source={{uri: artist.images[0].url}}
        />

        <Text className="text-base font-semibold">{artist.name}</Text>
      </View>
    </Link>
  );
}

export {Artists};
