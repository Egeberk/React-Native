import React, {useEffect, useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import Swiper from 'react-native-swiper';
import ForecastScroll from './Components/ForecastScroll';
import ForecastList from './Components/ForecastList/ForecastList';
import ReverseGeoCoder from './Components/AdressInfo';

// TAGS OR COMPONENTS
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

// API DETAILS
const api = {
  key: '',
  base: 'https://api.openweathermap.org/data/2.5/',
};

const App = () => {
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState(null);
  const [locationAvail, setlocationAvail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const city = 'Ankara';
  const latitude = '39.925533';
  const longitude = '32.866287';

  // Getting weather for location
  useEffect(() => {
    getWeatherForecast();
  }, [locationAvail]);
  
  // Getting permission for IOS
  const hasPermissionIOS = async () => {
    // Settings changes
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    
    const status = await Geolocation.requestAuthorization('whenInUse'); // Değişken tanımlayıp useState ile set edebilirsin (yukarıda tanımlanacak)

    // Location izni verilirse
    if (status === 'granted') {
      return true;
    }

    // Location isteği kabul edilmez ise
    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    // Location açık değil ise 
    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  // Location Permission for IOS
  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) { // bu haspermission kısmını belki kısaltabiliriz emin değili fazla ifli bir durum var
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) { // Diğer Ifleri de els if ile yapıp bıraz daha kısaltabilirsin
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  // Getting Location
  const getLocation = async () => {
    const hasPermission = await hasLocationPermission(); // haspermission kısmınıda değişken olarak tanımlayablirsin gibi duruyor(bakarız ona)

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        setlocationAvail(true);
        console.log(position); // kaldır bunu
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message); // bu belki durabilir kullanılıyorsa
        setLocation(null);
        console.log(error); // kaldır bunu gerekli ise dursun ama bence kaldır
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: true,
        showLocationDialog: true,
      },
    );
  };

  const getWeatherForecast = async () => {
    if (!locationAvail) {
      await getLocation(); 
    }

    if (!locationAvail) {
      return;
    }

    fetch(
      `${api.base}onecall?lat=${location?.coords?.latitude}&lon=${location?.coords?.longitude}&units=metric&exclude=minutely,alerts&appid=${api.key}`,
    )
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        console.log(result); // kaldır bunu
        setLoading(false);
      })
      .catch(error => {
        console.log('err');
        setError(true);
      });
  };

  // date builder for location 
  const dateBuilder = utcTime => {
    let time = ' ';
    var d = new Date(0);
    d.setUTCSeconds(utcTime);
    time =
      d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    return time;
  };

  // Weather background image or gif 
  const weatherBackground = () => {
    let src = '';

    // Belki biraz daha okunurluğunu arttırabiliriz
    // Bu if else kısımları için bir yöntem bulabiliriz
    // Hatta burada çok fazla fonksiyon olduğu için bunları ayırabiliriz belki
    if (weather.current.weather[0].main == 'Snow') {
      src = require('./assets/snow.gif');
    } else if ( // burayı net kısaltabilceğimiz bir yöntem vardır 3 değişken ile uğraşmadan
      weather.current.weather[0].main == 'Rain' ||
      weather.current.weather[0].main == 'Thunderstorm' ||
      weather.current.weather[0].main == 'Drizzle'
    ) {
      src = require('./assets/rain.gif');
    } else if (weather.current.weather[0].main == 'Clear') {
      src = require('./assets/clear.gif');
    } else if (weather.current.weather[0].main == 'Clouds') {
      src = require('./assets/clouds_night.gif');
    } else if (
      weather.current.weather[0].main == 'Mist' ||
      weather.current.weather[0].main == 'Fog'
    ) {
      src = require('./assets/mist.gif');
    } // Unidentified
    else {
      src = require('./assets/anomaly.gif');
    }

    return src;
  };

  const InnerView = () => {
    return (
      <View style={styles.viewInsideaView}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.text}> {weather.current.weather[0].main} </Text>
          <Text style={styles.text}>
            {' '}
            {weather.current.weather[0].description.charAt(0).toUpperCase() +
              weather.current.weather[0].description.slice(1)}{' '}
          </Text>
          <Text style={styles.text}>
            {' '}
            {Math.round(weather.current.temp)}°C{' '}
          </Text>
        </View>

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ForecastScroll data={weather.hourly} />
        </View>

        <View
          style={{flex: 0.7, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.text}> {dateBuilder(weather.current.dt)} </Text>

          <ReverseGeoCoder data={location.coords} />
        </View>

        <View style={{flex: 2, alignItems: 'center', width: '95%'}}>
          <ForecastList data={weather.daily.slice(1)} />
        </View>
      </View>
    );
  };

  if (error) {
    return (
      <ImageBackground
        source={require('./assets/no_internet.gif')}
        resizeMode="cover"
        style={styles.image}></ImageBackground>
    );
  }
  if (loading) {
    return (
      <View style={{backgroundColor: 'black', flex: 1}}>
        <Text> </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={weatherBackground()}
        resizeMode="cover"
        style={styles.image}
      >
        <InnerView />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'white', // #fff or #ffffff
  },
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white', // #fff or #ffffff
    fontSize: 30,
    fontFamily: 'Iowan Old Style',
    fontWeight: 'bold', // 600 (optional)
  },
  viewInsideaView: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '85%',
    borderColor: 'rgb(0, 0, 0)', // #000 or #000000
    borderWidth: 0.5,
    borderRadius: 10,
  },
});

export default App;
