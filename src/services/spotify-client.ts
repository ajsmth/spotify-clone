import * as Keychain from 'react-native-keychain';
import {authorize, refresh} from 'react-native-app-auth';
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_TOKEN_EXCHANGE_URL,
} from 'react-native-dotenv';

export const config = {
  clientId: SPOTIFY_CLIENT_ID,
  redirectUrl: 'musicapp:/oauth',
  scopes: [
    'user-read-email',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-private',
    'user-follow-read',
    'user-library-read',
  ],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: `${SPOTIFY_TOKEN_EXCHANGE_URL}/token`,
  },
};

const baseUrl = `https://api.spotify.com/v1`;

function spotify() {
  function getOauthCredentials() {
    return Keychain.getInternetCredentials(baseUrl).then((keychain) => {
      if (keychain) {
        return JSON.parse(keychain.password);
      }

      return undefined;
    });
  }

  async function refreshOauthToken() {
    const credentials = await getOauthCredentials();

    return refresh(
      {
        ...config,
        serviceConfiguration: {
          authorizationEndpoint: 'https://accounts.spotify.com/authorize',
          tokenEndpoint: `${SPOTIFY_TOKEN_EXCHANGE_URL}/refresh_token`,
        },
      },
      {
        refreshToken: credentials.refreshToken,
      },
    )
      .then((response) => {
        Keychain.setInternetCredentials(
          baseUrl,
          baseUrl,
          JSON.stringify({
            ...credentials,
            accessToken: response.accessToken,
            accessTokenExpirationDate: response.accessTokenExpirationDate,
          }),
        );

        return response;
      })
      .catch((error) => {
        console.log({error});
        Keychain.resetInternetCredentials(baseUrl);
      });
  }

  async function request(url: string, options: RequestInit = {}) {
    let credentials = await getOauthCredentials();

    if (!credentials) {
      return Promise.reject({error: 'No credentials '});
    }

    const currentDate = new Date();
    const expiryDate = new Date(credentials.accessTokenExpirationDate);

    if (currentDate.getTime() > expiryDate.getTime()) {
      credentials = await refreshOauthToken();
    }

    return fetch(`${baseUrl}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credentials.accessToken}`,
      },
    }).then((response) => response.json());
  }

  function login() {
    return authorize(config).then((response) => {
      return Keychain.setInternetCredentials(
        baseUrl,
        baseUrl,
        JSON.stringify({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          accessTokenExpirationDate: response.accessTokenExpirationDate,
        }),
      ).then(() => response);
    });
  }

  async function logout() {
    return Keychain.resetInternetCredentials(baseUrl);
  }

  return {
    request,
    login,
    logout,
    refresh: refreshOauthToken,
  };
}

const client = spotify();

export {client as spotify};
