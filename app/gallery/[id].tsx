import { useUser } from "@/context/UserContext";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../theme/colors";

export default function GalleryScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { user, loading } = useUser();
  const galleryName = params.id ?? "sem-nome";

  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.yellow }}>Carregando usuário...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.yellow }}>Faça login para ver esta galeria</Text>
      </View>
    );
  }

  const galleryPath = `${FileSystem.documentDirectory}roles/${user.id}/${galleryName}/`;

  const createDirIfNeeded = async () => {
    const info = await FileSystem.getInfoAsync(galleryPath);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(galleryPath, { intermediates: true });
    }
  };

  const listFiles = async (): Promise<string[]> => {
    const info = await FileSystem.getInfoAsync(galleryPath);
    if (!info.exists) return [];
    const files = await FileSystem.readDirectoryAsync(galleryPath);
    return files.map(f => `${galleryPath}${f}`);
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
      Alert.alert("Erro", "Não foi possível abrir a câmera.");
      return null;
    }
  };

  const writeFromUri = async (uri: string) => {
    await createDirIfNeeded();
    const fileName = uri.split("/").pop() ?? `photo_${Date.now()}.jpg`;
    const dest = `${galleryPath}${fileName}`;

    try {
      await FileSystem.moveAsync({ from: uri, to: dest });
    } catch {
      await FileSystem.copyAsync({ from: uri, to: dest });
      try { await FileSystem.deleteAsync(uri); } catch {}
    }
  };

  const loadImages = async () => {
    try {
      const items = await listFiles();
      setImages(items);
    } catch (err) {
      console.error("Erro loadImages:", err);
      setImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  const takePhoto = async () => {
    setLoadingImages(true);
    const uri = await pickImageUri();
    if (!uri) {
      setLoadingImages(false);
      return;
    }
    await writeFromUri(uri);
    await loadImages();
  };

  useFocusEffect(
    useCallback(() => {
      setLoadingImages(true);
      loadImages();
    }, [galleryName])
  );

  if (loadingImages)
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.yellow }}>Carregando fotos...</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={styles.title}>{decodeURIComponent(galleryName)}</Text>

        <FlatList
          data={images}
          keyExtractor={(i) => i}
          numColumns={2}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma foto ainda.</Text>}
          contentContainerStyle={images.length === 0 ? { flex: 1 } : { paddingBottom: 120 }}
        />

        <TouchableOpacity style={styles.fab} onPress={takePhoto}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { color: colors.yellow, fontSize: 22, fontWeight: "700", marginBottom: 10 },
  image: { width: "48%", height: 150, margin: "1%", borderRadius: 8, backgroundColor: colors.card },
  empty: { color: colors.text, textAlign: "center", marginTop: 50 },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  fabText: {
    color: colors.dark,
    fontSize: 28,
    fontWeight: "700",
  },
});