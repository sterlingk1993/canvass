import React, { PureComponent } from 'react';

import {
  Alert,
  PermissionsAndroid,
  Platform,
  DeviceEventEmitter,
} from 'react-native';

import Permissions from 'react-native-permissions';
import RNGLocation from 'react-native-google-location';
import RNGooglePlaces from 'react-native-google-places';

export default class OVComponent extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      myPosition: {latitude: null, longitude: null},
    }

    this.alerts = {
      active: false,
      queue: [],
    };
  }

  onLocationChange (e: Event) {
    let { myPosition } = this.state;
    myPosition = {
      latitude: e.Latitude,
      longitude: e.Longitude,
    };
    this.setState({ myPosition });
  }

  requestLocationPermission = async (callback) => {
    access = false;

    try {
      // Permissions calls out an Alert we can't queue up. A bit hacky...
      this.alerts.active = true;
      this.alerts.queue.push({});

      res = await Permissions.request('location');
      if (res === "authorized") access = true;

      // clean up after Permissions Alert
      this.alertFinish();
    } catch(error) {}

    if (access === true) {
      if (Platform.OS === 'android') {
        if (!this.evEmitter) {
          if (RNGLocation.available() === false) {
            this.setState({ serviceError: true });
          } else {
            this.evEmitter = DeviceEventEmitter.addListener('updateLocation', this.onLocationChange.bind(this));
            RNGLocation.reconnect();
            RNGLocation.getLocation();
          }
        }
      } else {
        this.getLocation();
        this.timerID = setInterval(() => this.getLocation(), 5000);
      }
    }

    this.setState({ locationAccess: access });

    return access;
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ myPosition: position.coords });
    },
    (error) => { },
    { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 });
  }

  cleanupLocation() {
    if (Platform.OS === 'ios') {
      clearInterval(this.timerID);
    } else {
      if (this.evEmitter) {
        RNGLocation.disconnect();
        this.evEmitter.remove();
      }
    }
  }

  alertPush(spec) {
    this.alerts.queue.push(spec);
    if (this.alerts.active === false) {
      this.alerts.active = true;
      this.alertDo();
    }
  }

  alertDo() {
    let alert = this.alerts.queue[0];
    Alert.alert(
      alert.title,
      alert.description,
      alert.funcs,
      { cancelable: false }
    );
  }

  alertFinish() {
    this.alerts.queue.shift();
    if (this.alerts.queue.length > 0) {
      this.alertDo();
    } else {
      this.alerts.active = false;
    }
  }

}
