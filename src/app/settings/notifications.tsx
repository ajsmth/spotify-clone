import React from 'react';
import {ScrollView, Text, View, Switch} from 'react-native';
import {styles} from '../../styles';

function Notifications() {
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 15}}>
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

      <View style={{ marginTop: 50 }} />

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
    <View style={{marginVertical: 10 }}>
      <Text style={[styles.h4, styles.bold, {textAlign: 'center'}]}>
        {title}
      </Text>
    </View>
  );
}

function CategoryHeader({title, description}) {
  return (
    <View style={{marginVertical: 15}}>
      <Text style={[styles.paragraph, styles.bold, {textAlign: 'center'}]}>
        {title}
      </Text>
      <Text
        style={[
          styles.small,
          {textAlign: 'center', color: 'gray', fontWeight: '600'},
        ]}>
        {description}
      </Text>
    </View>
  );
}

function NotificationToggle({title}) {
  return (
    <View style={{marginVertical: 5}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={[{fontWeight: '600'}]}>{title}</Text>
        <Switch />
      </View>
    </View>
  );
}

export {Notifications};
