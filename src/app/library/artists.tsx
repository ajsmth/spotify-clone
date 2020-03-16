import React from 'react';
import {View, Text, ScrollView, Image} from '../shared/tailwind';
import {Link} from 'earhart';
import {useArtistContext} from '../../providers/artist-provider';
import {api} from '../../services/api';
import {SharedElement} from 'earhart-shared-element';

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
        <SharedElement id={`artist-profile-image-${artist.id}`}>
          <Image
            className="w-16 h-16 mr-4 bg-gray-900"
            source={{uri: artist.images[0].url}}
          />
        </SharedElement>
        <View className="items-start">
          <SharedElement
            id={`artist-profile-name-${artist.id}`}
            config={{animated: 'fade', resize: 'clip', align: 'left-center'}}>
            <Text className="font-semibold text-xl w-full">{artist.name}</Text>
          </SharedElement>
        </View>
      </View>
    </Link>
  );
}

export {Artists};
