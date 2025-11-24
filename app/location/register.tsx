import { useUser } from "@/context/UserContext";
import * as Calendar from "expo-calendar";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../theme/colors";

export default function RegisterLocationScreen() {
  const router = useRouter();
  const { user, loading } = useUser();

  const [galleryName, setGalleryName] = useState("Meu rolê");
  const [creating, setCreating] = useState(false);

  // Espera o user carregar
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.yellow }}>Carregando usuário...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.yellow }}>Faça login para criar galerias</Text>
      </SafeAreaView>
    );
  }

  const GALLERIES_ROOT = `${FileSystem.documentDirectory}roles/${user.id}/`;

  const createCalendarEvent = async (title: string) => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") return;

      const calendars = await Calendar.getCalendarsAsync();
      const defaultCalendar =
        calendars.find((c: any) => c?.allowsModifications) ?? calendars[0];

      if (!defaultCalendar) return;

      await Calendar.createEventAsync(defaultCalendar.id, {
        title: `Rolê: ${title}`,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 60000),
        location: title,
      });
    } catch (err) {
      console.error("Erro ao criar evento:", err);
    }
  };

  const pickImageUri = async (): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Não é possível acessar a câmera.");
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({ quality: 1 });
      if (!result.canceled && result.assets?.[0]?.uri) return result.assets[0].uri;
      return null;
    } catch (err) {
      console.error("Erro ao abrir câmera:", err);
      return null;
    }
  };

  const handleCreateGallery = async () => {
    if (!galleryName.trim()) {
      Alert.alert("Erro", "Digite um nome válido!");
      return;
    }

    setCreating(true);

    try {
      // Garante pasta raiz do usuário
      const rootInfo = await FileSystem.getInfoAsync(GALLERIES_ROOT);
      if (!rootInfo.exists) {
        await FileSystem.makeDirectoryAsync(GALLERIES_ROOT, { intermediates: true });
      }

      // Caminho da galeria baseado no nome e timestamp
      const safeName = encodeURIComponent(galleryName.trim().replace(/\s+/g, "_"));
      const galleryDir = `${GALLERIES_ROOT}${safeName}_${Date.now()}/`;

      await FileSystem.makeDirectoryAsync(galleryDir, { intermediates: true });

      // Cria evento no calendário
      await createCalendarEvent(galleryName);

      // Tirar foto
      const uri = await pickImageUri();
      if (!uri) {
        setCreating(false);
        return;
      }

      // Salva primeira foto na galeria
      const fileName = `photo_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: uri, to: `${galleryDir}${fileName}` });

      Alert.alert("Sucesso!", "Galeria criada e foto salva!");

      // Navega para a lista de galerias
      router.push("/gallery");
    } catch (err) {
      console.error("Erro ao criar galeria:", err);
      Alert.alert("Erro", "Não foi possível criar a galeria.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.content}>
        <Text style={styles.label}>Nome do rolê</Text>

        <TextInput
          value={galleryName}
          onChangeText={setGalleryName}
          editable={!creating}
          placeholder="Ex: Churrasco no AP"
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, creating && { opacity: 0.7 }]}
          onPress={handleCreateGallery}
          disabled={creating}
        >
          <Text style={styles.buttonText}>
            {creating ? "Criando..." : "Tirar primeira foto e criar galeria"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.dark 
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: { 
    color: colors.yellow, 
    fontSize: 16, 
    marginTop: 10 
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.yellow,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: { 
    color: colors.dark, 
    fontWeight: "600", 
    fontSize: 16 
  },
});