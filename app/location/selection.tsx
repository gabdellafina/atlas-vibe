import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../theme/colors";

export default function LocationSelectionScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const response = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (!response || response.length === 0) return null;
      const addr = response[0];
      return {
        streetName: addr.street || null,
        streetNumber: addr.name || null,
        district: addr.district || null,
        city: addr.city || null,
        region: addr.region || null,
        country: addr.country || null,
      };
    } catch (err) {
      console.error("Erro reverseGeocode:", err);
      return null;
    }
  };

  const handleGetLocation = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Permissão de localização negada.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = location.coords;

      // BUSCA NOME DA RUA / ENDEREÇO
      const address = await getAddressFromCoords(latitude, longitude);

      let generatedName = "";

      if (address?.streetName) {
        generatedName = `${address.streetName} - ${address.city ?? ""}`;
      } else if (address?.district) {
        generatedName = `${address.district} - ${address.city ?? ""}`;
      } else {
        generatedName = `Meu rolê - ${new Date().toLocaleDateString("pt-BR")}`;
      }

      router.push({
        pathname: "/location/register",
        params: {
          name: generatedName,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        },
      });
    } catch (err) {
      console.error("Erro ao obter localização:", err);
      alert("Erro ao obter localização.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.content}>
        <Text style={styles.title}>Criar novo registro</Text>
        <Text style={styles.subtitle}>
          Pegaremos sua localização e geraremos o nome automaticamente.
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGetLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.dark} />
          ) : (
            <Text style={styles.buttonText}>Usar minha localização</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.yellow,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: "600",
  },
});