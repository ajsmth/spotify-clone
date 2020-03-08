import React from 'react';
import {View, Switch, Text, Slider, ScrollView} from 'react-native';
import {styles} from '../../styles';

function Playback() {
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 15}}>
      <OptionSwitch
        title="Offline"
        description={`When you go offline, you'll only be able to play the music and podcasts you've downloaded`}
      />

      <OptionSlider title="Crossfade" labelLeft="0s" labelRight="12s" />

      <OptionSwitch title="Gapless Playback" />

      <OptionSwitch
        title="Automix"
        description={`Allows smooth transitions between songs in a playlist`}
      />
      <OptionSwitch title="Hide Unplayable Songs" />
      <OptionSwitch title="Enable Audio Normalization" />

      <RadioSelect
        title="Volume level"
        options={[
          {
            title: 'Loud',
            description: '(might reduce dynamics)',
          },
          {title: 'Normal'},
          {title: 'Quiet', description: '(preserves dynamics)'},
        ]}
      />

      <OptionSwitch title="Play Feedback Sounds" />

      <OptionSwitch
        title="Autoplay"
        description={`Enjoy nonstop music. We'll play you similar songs when your music ends.`}
      />

      <OptionSwitch
        title="Canvas"
        description={`Display short, looping visuals`}
      />
    </ScrollView>
  );
}

interface IOptionSwitch {
  title: string;
  description?: string;
}

function OptionSwitch({title, description}: IOptionSwitch) {
  return (
    <View style={{marginVertical: 15}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={[styles.paragraph, styles.semibold]}>{title}</Text>
        <Switch />
      </View>

      {description && (
        <Text
          style={[
            styles.paragraph,
            {color: 'gray', lineHeight: 20, padding: 5},
          ]}>
          {description}
        </Text>
      )}
    </View>
  );
}

function OptionSlider({title, labelLeft, labelRight}) {
  return (
    <View>
      <Text style={[styles.h4, styles.bold]}>{title}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[styles.small, {color: 'gray'}]}>{labelLeft}</Text>
        <View style={{flex: 1, paddingHorizontal: 10}}>
          <Slider />
        </View>
        <Text style={[styles.small, {color: 'gray'}]}>{labelRight}</Text>
      </View>
    </View>
  );
}

interface IRadioSelect {
  title: string;
  options: any[];
}

function RadioSelect({title, options = []}: IRadioSelect) {
  return (
    <View>
      <Text style={[styles.h4, styles.bold]}>{title}</Text>

      {options.map((option: any, index) => {
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <Text style={[styles.paragraph, {marginRight: 5}]}>
              {option.title}
            </Text>
            <Text style={[styles.small, {color: 'gray'}]}>
              {option.description}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export {Playback};
