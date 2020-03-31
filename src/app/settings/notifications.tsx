import React from 'react';
import {Switch} from 'react-native';
import {ScrollView, Text, View} from '../shared/tailwind';

function Notifications() {
  return (
    <ScrollView className='flex-1 bg-white p-4' contentContainerStyle={{ paddingBottom: 20 }}>
      <SectionHeader title="Your Music" />

      <View>
        <CategoryHeader
          title="Recommended Music"
          description={`Music we find that we think you'll like`}
        />
        <NotificationToggle title="Push Notification" />
        <NotificationToggle title="Email Notification" />
      </View>

      <View>
        <CategoryHeader
          title="New Music"
          description={`Fresh tracks from artists you follow or might like`}
        />
        <NotificationToggle title="Push Notification" />
        <NotificationToggle title="Email Notification" />
      </View>

      <View>
        <CategoryHeader
          title="Playlist Updates"
          description={`A playlist you follow is updated`}
        />
        <NotificationToggle title="Push Notification" />
        <NotificationToggle title="Email Notification" />
      </View>

      <View>
        <CategoryHeader
          title="Concert Notifications"
          description={`Updates about live shows by artists you like, in places near you`}
        />
        <NotificationToggle title="Push Notification" />
        <NotificationToggle title="Email Notification" />
      </View>

      <View>
        <CategoryHeader
          title="Artist Updates"
          description={`Hear about artists you listen to and artists we think you'll like`}
        />
        <NotificationToggle title="Push Notification" />
        <NotificationToggle title="Email Notification" />
      </View>

      <View style={{marginTop: 50}} />

      <SectionHeader title="Spotify Updates" />

      <View>
        <View>
          <CategoryHeader
            title="Product News"
            description={`Get started, new features and the latest product updates on Spotify`}
          />
          <NotificationToggle title="Push Notification" />
          <NotificationToggle title="Email Notification" />
        </View>
      </View>

      <View>
        <CategoryHeader
          title="Spotify News and Offers"
          description={`News, promos and events for you`}
        />
        <NotificationToggle title="Push Notification" />
        <NotificationToggle title="Email Notification" />
      </View>
    </ScrollView>
  );
}

function SectionHeader({title}) {
  return (
    <View className="my-2">
      <Text className="text-3xl font-extrabold text-center">{title}</Text>
    </View>
  );
}

function CategoryHeader({title, description}) {
  return (
    <View className="my-4">
      <Text className="text-lg font-bold text-center">{title}</Text>
      <Text className="mt-2 text-sm text-center text-gray-600 font-medium">
        {description}
      </Text>
    </View>
  );
}

function NotificationToggle({title}) {
  return (
    <View className="my-1">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold">{title}</Text>
        <Switch />
      </View>
    </View>
  );
}

export {Notifications};
