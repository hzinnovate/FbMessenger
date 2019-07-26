import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Login, SignUp} from './AuthScreens'
import {ChatList} from './messengerScreens'
import MainTabBottom from './Config/navigator'
import {Provider} from 'react-redux';
import { store, persistor } from './Redux/Store';
import { PersistGate } from 'redux-persist/integration/react'

export default function Main() {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <MainTabBottom />
      </PersistGate>
    </Provider>
  );
}