interface IPlaylist {
  collaborative: boolean;
  description: string;
  href: string;
  id: string;
  images: IImage[];
  name: string;
  owner: {
    display_name: string;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string | null;
  public: boolean;
  tracks: ITrack[];
  type: string;
  uri: string;
}

interface ITrack {
  album: IAlbum;
  artists: IArtist[];
  available_markets: string[];
  disc_number: number;
  duration: number;
  episode: boolean;
  explicit: boolean;
  href: string;
  id: string;
  images: IImage[];
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

interface IImage {
  width: number | null;
  height: number | null;
  url: string;
}

interface IAlbum {
  album_type: string;
  artists: IArtist[];
  available_markets: string[];
  href: string;
  id: string;
  images: IImage[];
  name: string;
  release_date: string;
  total_tracks: number;
  tpye: string;
  uri: string;
  tracks: ITrack[];
}

interface IArtist {
  id: string;
  href: string;
  name: string;
  type: string;
  uri: string;
  images: IImage[];
  tracks: ITrack[];
  albums: IAlbum[];
}

interface IPlaylistItem {
  id: number;
  song: string;
  artist: string;
  album: string;
}

interface ICollection {
  id: string;
  ids: string[];
}

interface IPodcast {
  id: number;
  title: string;
  image: string;
  subtitle: string;
  company: string;
  tagline: string;
  episodes: IPodcastEpisode[];
}

interface IPodcastEpisode {
  id: number;
  title: string;
  company: string;
  description: string;
  duration: number;
}

interface IOauthCredentials {
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationDate: string;
}

interface IUser {
  country: string;
  display_name: string;
  email: string;
  href: string;
  id: string;
  images: {
    height?: number;
    width?: number;
    url: string;
  }[];
  product: 'premium' | 'free';
  type: 'user';
  uri: string;
}

interface ICategory {
  href: string;
  icons: IImage[];
  id: string;
  name: string;
}
