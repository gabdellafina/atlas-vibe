import { useUser } from "@/context/UserContext";
import * as FileSystem from "expo-file-system/legacy";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../theme/colors";

type GalleryItem = {
  folderName: string;
  displayName: string;
  preview?: string;
  count: number;
};

export default function GalleryListScreen() {
  const { user, loading } = useUser();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);

  const GALLERIES_ROOT = user
    ? `${FileSystem.documentDirectory}roles/${user.id}/`
    : null;

  const loadGalleries = async () => {
    if (!GALLERIES_ROOT) return;

    try {
      const info = await FileSystem.getInfoAsync(GALLERIES_ROOT);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(GALLERIES_ROOT, { intermediates: true });
      }

      const dirs = await FileSystem.readDirectoryAsync(GALLERIES_ROOT);

      const items: GalleryItem[] = await Promise.all(
        dirs.map(async (folderName) => {
          const path = `${GALLERIES_ROOT}${folderName}/`;
          const files = await FileSystem.readDirectoryAsync(path);

          const preview = files[0] ? `${path}${files[0]}` : undefined;

          const displayName = folderName
            .replace(/_\d+$/, "") // remove timestamp
            .replace(/_/g, " ");  // substitui _ por espaço

          return { folderName, displayName, preview, count: files.length };
        })
      );

      setGalleries(items);
    } catch (err) {
      console.error("Erro ao carregar galerias:", err);
      setGalleries([]);
    }
  };

  // Sempre chamado — e só carrega quando houver usuário
  useEffect(() => {
    if (user) loadGalleries();
  }, [user]);

  // --- SOMENTE A PARTIR DAQUI COMEÇAM OS RETURNS ---
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.yellow }}>Carregando galerias...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.yellow }}>Faça login para ver suas galerias</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galerias</Text>

      {galleries.length === 0 ? (
        <Text style={styles.empty}>Nenhuma galeria criada ainda.</Text>
      ) : (
        <FlatList
          data={galleries}
          keyExtractor={(i) => i.folderName}
          numColumns={2}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/gallery/[id]",
                params: { id: item.folderName },
              }}
              asChild
            >
              <TouchableOpacity style={styles.galleryItem}>
                {item.preview ? (
                  <Image source={{ uri: item.preview }} style={styles.image} />
                ) : (
                  <View style={[styles.image, { justifyContent: "center", alignItems: "center" }]}>
                    <Text style={{ color: colors.text }}>Sem fotos</Text>
                  </View>
                )}

                <Text style={styles.galleryName}>{item.displayName}</Text>
                <Text style={styles.count}>{item.count} fotos</Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark, padding: 10 },
  title: { color: colors.yellow, fontSize: 22, fontWeight: "700", marginBottom: 10 },
  empty: { color: colors.text, textAlign: "center", marginTop: 50 },
  galleryItem: { flex: 1, margin: 5, borderRadius: 12, overflow: "hidden", backgroundColor: colors.card },
  image: { width: "100%", height: 120, backgroundColor: colors.border },
  galleryName: { color: colors.text, fontWeight: "600", marginTop: 6, paddingHorizontal: 6 },
  count: { color: colors.text, opacity: 0.7, fontSize: 12, paddingHorizontal: 6, marginBottom: 6 },
});
