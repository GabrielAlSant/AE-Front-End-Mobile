import { View, Button } from "react-native";
import { useEffect, useRef, useState} from "react";
import { StyleSheet } from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationAccuracy,
  LocationObject,
  watchPositionAsync,
} from "expo-location";
import MapView from "react-native-maps";
import Maps from "./map";


interface Props {
  onSelecionarLocalizacao: (coords: { latitude: number; longitude: number }) => void;
}

export default function CurrentLocationPage({ onSelecionarLocalizacao }: Props) {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [markers, setMarkers] = useState<
    {
      idDispositivo: string;
      latitude: number;
      longitude: number;
      descricao: string;
    }[]
  >([]);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    async function requestPermission() {
      const { status } = await requestForegroundPermissionsAsync();
      if (status === "granted") {
        const currentPosition = await getCurrentPositionAsync();
        setLocation(currentPosition);
      }
    }
    requestPermission();
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

  async function confirmarLocalizacao() {
    const currentPosition = await getCurrentPositionAsync();
    onSelecionarLocalizacao({
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
    });
  }

  useEffect(() => {
    fetch('https://projeto-vias-sjrv.vercel.app/RETORNARTODOSBURACOS')
      .then(response => response.json())
      .then(data => {
        setMarkers(data);
        console.log(markers)
      })
  }, []);


  return (
    <View style={{ flex: 1 }}>
      <Maps markers={markers} location={location} mapRef={mapRef} styles={styles}/>
      <Button title="Confirmar Localização" onPress={confirmarLocalizacao} />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "90%", 
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
