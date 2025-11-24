import * as Location from 'expo-location';
import { Link } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import colors from "../../theme/colors";

type LocationType = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const initialRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header title=" " />

      <View style={styles.mapContainer}>
        {location && initialRegion ? (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
          />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.loadingText}>
              {errorMsg || "Carregando mapa..."}
            </Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <Link href="/location/selection" asChild>
            <TouchableOpacity style={styles.registerButton}>
              <MapPin size={24} color={colors.dark} />
              <Text style={styles.buttonText}>Novo Registro</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: colors.text,
    fontSize: 16,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: colors.yellow,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});