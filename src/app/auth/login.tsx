import React from 'react';
import {Navigator, Tabs, useNavigate, Route, Routes} from 'earhart';
import {View, Text, Pressable} from '../shared/tailwind';
import {useAuth} from '../../providers/auth-provider';
import {SafeAreaView} from 'react-native';

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <View className="flex-1 bg-gray-400 justify-center p-4">
      <SafeAreaView />
      <Text className="p-8 text-3xl font-bold text-center">Login</Text>
      <View className="flex-1" />

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

      <SafeAreaView />
    </View>
  );
}

export {Login};
