import React from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    SafeAreaView, 
    Image,
    ImageBackground,
    StyleSheet 
} from 'react-native';

const ForecastData = (props) => {

    return(
        <View 
            key={(props.item.dt).toString()} 
            style={{
              justifyContent : 'center', 
              alignItems: 'center', 
              margin: 5 
            }}
        >
            <Text style={{color: '#fff'}}>  
                { (props.index==0) ? 'Now' : getDateHours(props.item.dt) }
            </Text>
            <Image 
                source={{
                    uri: 'https://openweathermap.org/img/wn/'+props.item.weather[0].icon+'@2x.png'
                }} 
                style={{
                   width: 30, 
                   height: 30,
                   marginLeft: 4
                }}
            />
            <Text style={{color: '#fff'}}>  
                {Math.round(props.item.temp)}°
            </Text>
        </View>
    )
}

function getDateHours(utcTime) // Bunu yukarı alabiliyorsan yukarı al daha iyi olur 
  {
    let time = ' ';
    var d = new Date(0); 
    d.setUTCSeconds(utcTime);
    time = (d.getHours()<10?'0':'') + d.getHours();
    return time;
  }

export default ForecastData;
