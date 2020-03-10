import create from '../winona';
import {spotify} from './spotify-client';
const [router, client] = create();

// ARTISTS ===========================================================================
router.get('/me/artists', () => {
  return spotify
    .request(`/me/following?type=artist`)
    .then(response => response.artists.items as IArtist[]);
});

// ALBUMS ===========================================================================
router.get('/albums/me', () => {
  return spotify
    .request(`/me/albums`)
    .then(response => response.items.map(item => item.album) as IAlbum[]);
});

router.get('/artists/:id/albums', options => {
  return spotify
    .request(`/artists/${options.params.id}/albums`)
    .then(response => response.items as IAlbum[]);
});

// TRACKS ===========================================================================
router.get('/artists/:id/tracks', options => {
  return spotify
    .request(`/artists/${options.params.id}/top-tracks?country=CA`)
    .then(response => response.tracks as ITrack[]);
});

router.get('/playlists/:id/tracks', options => {
  return spotify
    .request(`/playlists/${options.params.id}/tracks`)
    .then(
      response =>
        response.items.map(item => item.track).filter(Boolean) as ITrack[],
    );
});

router.get('/albums/:id/tracks', options => {
  return spotify
    .request(`/albums/${options.params.id}/tracks`)
    .then(response => {
      return response.items;
    });
});

// PLAYLISTS ===========================================================================
router.get('/playlists/featured', () => {
  return spotify
    .request(`/browse/featured-playlists`)
    .then(response => response.playlists.items as IPlaylist[]);
});

router.get('/playlists/me', () => {
  return spotify
    .request(`/me/playlists`)
    .then(response => response.items as IPlaylist[]);
});

router.get('/playlists/:id', options => {
  return spotify
    .request(`/browse/categories/${options.params.id}/playlists`)
    .then(response => response.playlists.items as IPlaylist[]);
});

// USER PROFILES =======================================================================

router.get('/users/:id/playlists', options => {
  return spotify
    .request(`/users/${options.params.id}/playlists?${options.query}`)
    .then(response => response.items as IPlaylist[]);
});

// AUTH ===========================================================================
router.get('/auth/login', () => {
  return spotify.login();
});

router.get('/auth/logout', () => {
  return spotify.logout();
});

router.get('/auth/refresh', () => {
  return spotify.refresh();
});

router.get('/me', () => {
  return spotify.request('/me');
});

export {client as api};
