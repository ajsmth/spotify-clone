import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {Link} from '../../earhart';
import {styles} from '../../styles';
import {useArtistContext} from '../../providers/artist-provider';
import {api} from '../../services/api'

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
    <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 15}}>
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
    <Link
      to={to}
      style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
      <Image
        style={{width: 70, height: 70, borderRadius: 35, marginRight: 10}}
        source={{uri: artist.images[0].url}}
      />

      <View>
        <Text style={[styles.paragraph, styles.semibold]}>{artist.name}</Text>
      </View>
    </Link>
  );
}

export {Artists};
