import React from 'react';
import {useNavigator} from '../../earhart';
import {View, Text, Pressable, SafeAreaView} from '../shared/tailwind';
import {useAuth} from '../../providers/auth-provider';

function Login() {
  const auth = useAuth();
  const {navigate} = useNavigator();

  return (
    <SafeAreaView className="flex-1 bg-white justify-center p-4">
      <Text className="p-8 text-3xl font-bold text-center">Login</Text>
      <View className="px-8">
        <Pressable
          className="p-8 my-10 border-gray-700 border justify-center items-center rounded-lg"
          onPress={() => {
            auth.login().then(() => {
              navigate('/home');
            });
          }}>
          <Text className="text-lg text-gray-800 font-semibold">
            Log In with Facebook
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export {Login};
