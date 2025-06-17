import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import { useEffect, useState, useRef } from "react";
import MapView from "react-native-maps";

import Maps from "../components/map";

export default function VerBuracos(){
      const [location, setLocation] = useState<LocationObject | null>(null);
      const [markers, setMarkers] = useState<
        {
          idDispositivo: string;
          latitude: number;
          longitude: number;
        }[]
      >([]);
const mapRef = useRef<MapView>(null);

  async function requestLocationPermition() {
    const { status } = await requestForegroundPermissionsAsync();

    if (status) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermition();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          center: response.coords,
        });
      }
    );
  }, []);

useFocusEffect(
  useCallback(() => {
    fetch('https://projeto-vias-sjrv.vercel.app/RETORNARTODOSBURACOS')
      .then(response => response.json())
      .then(data => {
        setMarkers(data);
      })
      .catch(error => {
        console.error('Erro ao buscar buracos:', error);
      });
  }, [])
);

    return(
        <>
             <Maps markers={markers} location={location} mapRef={mapRef} styles={styles} />
        </>
    )
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%", 
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});