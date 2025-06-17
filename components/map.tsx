import {
  LocationObject
} from "expo-location";
import MapView, { Marker } from "react-native-maps";


interface MarkerType {
  latitude: number;
  longitude: number;
}

interface MapsProps {
  markers: MarkerType[];
  location: LocationObject | null;
  mapRef: any;
  styles: any
}


export default function Maps({ markers, location, mapRef, styles }: MapsProps) {
  return (
    <>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0005,
            longitudeDelta: 0.0005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Você está aqui"
          />

          {markers && markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={`Buraco ${index + 1}`}
              description="Buraco Reportado"
              image={
                  require("../assets/Prioridades/Prioridade Alta.png")
              }
            />
          ))}
        </MapView>
      )}
    </>
  );
}
