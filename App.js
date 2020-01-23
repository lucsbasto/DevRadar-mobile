import React from 'react';
import Routes from './src/routes';
import { StatusBar, YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Cannot connect to the Metro server.'])

export default function App() {
  return (
  <>
    <StatusBar backgroundColor="#4a258b" barStyle="light-content"/> 
    <Routes />
  </>
  );
}
