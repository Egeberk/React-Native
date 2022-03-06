import {
  View,
  Text,
  ScrollView,
  FlatList,
  SafeAreaView,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';

import React from 'react';

import ForecastListItem from './ForecastListItem';

export default function ForecastList(props) {
  return (
    <FlatList
      keyExtractor={item => item.dt}
      data={props.data}
      ItemSeparatorComponent={separatorComp}
      renderItem={({item}) => <ForecastListItem data={item} />}
    />
  );
}

const separatorComp = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: 'white',
    alignSelf:'center'
  }
});
