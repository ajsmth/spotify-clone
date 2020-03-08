import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {Link} from '../../earhart';
import {styles} from '../../styles';
import {useAlbumContext} from '../../providers/album-provider';
import {api} from '../../services/api';

function Albums({to}) {
  const [state, dispatch] = useAlbumContext();
  const [albumIds, setAlbumIds] = React.useState([]);

  React.useEffect(() => {
    api.get('/me/albums').then(albums => {
      dispatch({
        type: 'UPDATE_MANY',
        data: albums,
      });

      setAlbumIds(albums.map(album => album.id));
    });
  }, []);

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 15}}>
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
    <Link
      to={to}
      style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
      <Image
        style={{width: 70, height: 70, marginRight: 10}}
        source={{uri: album.images[0].url}}
      />

      <View>
        <Text style={[styles.paragraph, styles.semibold]}>{album.name}</Text>
        <Text style={[styles.small, {color: 'gray'}]}>
          {album.artists[0]?.name}
        </Text>
      </View>
    </Link>
  );
}

export {Albums};
