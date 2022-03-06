import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Image,ImageBackground,StyleSheet } from 'react-native';
import ForecastData from './ForecastData';

const ForecastScroll = (props) => {
    return(
        <View style= {styles2.top}>
            <ScrollView horizontal={true} contentContainerStyle={{justifyContent : 'center', alignItems: 'center' }}>
            {((props.data).slice(0,12)).map((item,index)=>(
              
              <ForecastData item = {item} key = {index} index= {index} />
              
              )
                   
          )}
            </ScrollView>
          </View>
    )
}

const styles2 = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: "#fff",
      padding: 20,
      margin: 10,
    },
    top: {
      flex: 1,
      //backgroundColor: 'rgba(52, 52, 52, 0.5)',
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      borderBottomWidth: 1,
      borderTopColor: 'white',
      borderTopWidth: 1,
      borderBottomColor: 'white',
      margin: 15
    },
    middle: {
      flex: 0.3,
      backgroundColor: "beige",
      borderWidth: 5,
    },
    bottom: {
      flex: 0.3,
      backgroundColor: "pink",
      borderWidth: 5,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
  });

export default ForecastScroll;