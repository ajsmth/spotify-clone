import React from 'react';
import {Switch, Slider} from 'react-native';
import {View, Text, ScrollView} from '../shared/tailwind';

function Playback() {
  return (
    <ScrollView className="p-4 flex-1 bg-white">
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
    <View className="my-4">
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold">{title}</Text>
        <Switch />
      </View>

      {description && (
        <Text className="p-1 text-base text-gray-700">{description}</Text>
      )}
    </View>
  );
}

function OptionSlider({title, labelLeft, labelRight}) {
  return (
    <View>
      <Text className="my-2 text-3xl font-bold">{title}</Text>
      <View className="flex-row items-center">
        <Text className="text-sm text-gray-700">{labelLeft}</Text>
        <View className="flex-1 px-3">
          <Slider />
        </View>
        <Text className="text-sm text-gray-700">{labelRight}</Text>
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
      <Text className="my-2 text-3xl font-bold">{title}</Text>

      {options.map((option: any, index) => {
        return (
          <View key={index} className="py-2 flex-row items-center">
            <Text className='mr-2 text-base'>
              {option.title}
            </Text>
            <Text className='text-sm text-gray-500' style={{ lineHeight: 20 }}>
              {option.description}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export {Playback};
