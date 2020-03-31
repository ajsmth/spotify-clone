import React from 'react';
import {View, Text, ScrollView, Image} from '../shared/tailwind';
import {Link} from '../../earhart';
import {useArtistContext} from '../../providers/artist-provider';
import {api} from '../../services/api';
import {PerformantScreen} from '../shared/performant-screen';

function Artists({to}) {
  const [state, dispatch] = useArtistContext();
  const [artistIds, setArtistIds] = React.useState([]);

  React.useEffect(() => {
    api.get('/artists/me').then(artists => {
      dispatch({
        type: 'UPDATE_MANY',
        data: artists,
      });

      setArtistIds(artists.map(item => item.id));
    });
  }, []);

  return (
    <PerformantScreen>
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
    </PerformantScreen>
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

export {Artists};
