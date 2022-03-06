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

export default function ForecastListItem(props) {
  return (
    <View style={{flexDirection: 'row',alignSelf:'center',alignItems:'center', justifyContent: 'space-between', width: '90%',marginTop:3,marginBottom:3}}>
      <Text style={styles.textDay}>{getDayName(props.data.dt)}</Text>

      <Image source={{
                uri: 'https://openweathermap.org/img/wn/'+props.data.weather[0].icon+'@2x.png'}} style={{width: 30, height:30}}/>

      <Text style={styles.textTempMax}>{Math.round(props.data.temp.max)}°</Text>

      <Text style={styles.textTempMin}>{Math.round(props.data.temp.min)}°</Text>
    </View>
  );
}

function getDayName(utcTime){
    var date = new Date(0);
    date.setUTCSeconds(utcTime);

    const options = { weekday: 'long' };

    let day = date.toLocaleDateString('en-GB',options);

    return day;
}

const styles = StyleSheet.create({
  textDay: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Iowan Old Style',
    fontWeight: 'bold',
    paddingLeft: 1,
    width: 85
  },
  textTempMax:{
      color: 'rgb(252, 125, 61)',
      fontSize: 15,
      width: 40,
      paddingLeft:10
  },
  textTempMin:{
      color: 'rgb(117, 186, 255)',
      fontSize: 15,
      width: 40,
      paddingLeft:10
  }
});
