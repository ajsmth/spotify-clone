import React from 'react';
import {Navigator, Tabs, useNavigate, Route, Routes} from '../../earhart';
import {View, Text, Button} from 'react-native';
import {useAuth} from '../../providers/auth-provider';


function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Login</Text>
      <Button
        title="Login via oauth"
        onPress={async () => {
          // @ts-ignore
          auth.login().then(() => {
            navigate('/home');
          });
        }}
      />
    </View>
  );
}

export { Login }