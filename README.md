# spotify-clone

A playground for testing out different React Native techniques and libraries, architecture and design patterns using Spotify as a backend. This app serves as a testing ground for `earhart` - a new, router based approach to navigation in React Native.

## Installation 

```bash
yarn && cd ios pod install
```

## Environment 

The app requires that you setup a token exchange service - instructions on how to do that can be found here:
https://ajsmth.com/blog/react-native-oauth/ 

Once everything is setup, update your `.env` file to point to this server with your Spotify client id and you should be off to the races

```
SPOTIFY_CLIENT_ID=
SPOTIFY_TOKEN_EXCHANGE_URL=
```

