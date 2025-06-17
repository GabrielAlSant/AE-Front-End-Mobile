import { View, Button, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationAccuracy,
  LocationObject,
  watchPositionAsync,
} from "expo-location";

interface Props {
  onSelecionarLocalizacao: (coords: { latitude: number; longitude: number }) => void;
}

export default function CurrentLocationPage({ onSelecionarLocalizacao }: Props) {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);

 
  useEffect(() => {
    async function requestPermission() {
      const { status } = await requestForegroundPermissionsAsync();
      if (status === "granted") {
        const currentPosition = await getCurrentPositionAsync();
        setLocation(currentPosition);
        setSelectedCoords({
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        });
      }
    }
    requestPermission();
  }, []);

  // Atualiza a câmera do mapa conforme a posição se move
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

  // Evento de clique no mapa
  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });
  };

  const confirmarLocalizacao = () => {
    if (selectedCoords) {
      onSelecionarLocalizacao(selectedCoords);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {selectedCoords && (
            <Marker coordinate={selectedCoords} title="Local Selecionado" />
          )}
        </MapView>
      )}
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
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
});
