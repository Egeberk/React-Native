import React, {useEffect, useState} from 'react';
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

const geoCoderApi = {
  key: '',
  base: 'https://api.opencagedata.com/geocode/v1/json',
};

const ReverseGeoCoder = props => {
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = () => {
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${props.data.latitude}+${props.data.longitude}&pretty=1&key=.`,
    )
      .then(res => res.json())
      .then(result => {
        setAddress(result);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        //setError(true);
      });
  };

  function addressFormatter(addressComps) {
    if (addressComps.town) {
      if (addressComps.city) {
        return addressComps.town + ', ' + addressComps.city;
      }
    }

    if (addressComps.state) {
      if (addressComps.town) {
        return addressComps.town + ', ' + addressComps.state;
      } else if (addressComps.city) {
        return addressComps.city + ', ' + addressComps.state;
      }
    }
    return addressComps.country;
  }

  if (loading) {
    return <Text style={styles.text}> Fetching.. </Text>;
  }
  return (
    <Text style={styles.text}>
      {' '}
      {addressFormatter(address.results[0].components)}{' '}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'Iowan Old Style',
    fontWeight: '600',
  },
});

export default ReverseGeoCoder;
