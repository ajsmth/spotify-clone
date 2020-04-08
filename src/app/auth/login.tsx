import React from 'react';
import {View, Text, Pressable, SafeAreaView} from '../shared/tailwind';
import {useAuth} from '../../providers/auth-provider';
import {AppLoader, useAppLoader} from '../shared/app-loader';
import {api} from '../../services/api';
import {useUser} from '../../providers/user-provider';
import {useNavigator} from '../../earhart';

function Login() {
  const auth = useAuth();
  const {navigate} = useNavigator();
  const updateUser = useUser((state) => state.update);
  const {enter, success, error} = useAppLoader();

  function onLogin() {
    enter();

    auth
      .login()
      .then(() => {
        api.get('/me').then((user) => {
          updateUser(user);
          navigate('/home');
          success();
        });
      })
      .catch(() => {
        error();
      });
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-center p-4">
      <Text className="p-8 text-3xl font-bold text-center">Login</Text>
      <View className="px-8">
        <Pressable
          className="p-8 my-10 border-gray-700 border justify-center items-center rounded-lg"
          onPress={onLogin}>
          <Text className="text-lg text-gray-800 font-semibold">
            Log In with Facebook
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export {Login};
