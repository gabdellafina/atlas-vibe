import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system/legacy";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Switch, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useUser } from "../../context/UserContext";
import { db } from "../../services/firestore";
import colors from "../../theme/colors";

const GALLERIES_ROOT = `${FileSystem.documentDirectory}roles/`;

export default function NotificationsScreen() {
  const { user } = useUser();

  const [waterReminder, setWaterReminder] = useState(false);
  const [waterInterval, setWaterInterval] = useState(30);

  const [photoReminder, setPhotoReminder] = useState(false);
  const [photoInterval, setPhotoInterval] = useState(15);

  // 🔥 Carrega Configurações do Firestore
  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      const ref = doc(db, `users/${user.id}/settings/notifications`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setWaterReminder(data.waterReminder ?? false);
        setWaterInterval(data.waterInterval ?? 30);
        setPhotoReminder(data.photoReminder ?? false);
        setPhotoInterval(data.photoInterval ?? 15);
      }
    }
    load();
  }, [user]);

  // 🔥 Salva automaticamente quando muda (merge mantém outros dados)
  useEffect(() => {
    if (!user?.id) return;
    const ref = doc(db, `users/${user.id}/settings/notifications`);
    setDoc(
      ref,
      { waterReminder, waterInterval, photoReminder, photoInterval },
      { merge: true } // ← evita apagar dados existentes
    );
  }, [waterReminder, waterInterval, photoReminder, photoInterval]);

  // 🔥 Permissões
  useEffect(() => {
    Notifications.requestPermissionsAsync().then(({ status }) => {
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Não será possível enviar notificações.");
      }
    });
  }, []);

  // 🔥 Notificação de hidratação
  useEffect(() => {
    if (!waterReminder) return;
    const interval = setInterval(() => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Hora de se hidratar 💧",
          body: "Não esqueça de beber água!",
        },
        trigger: null,
      });
    }, waterInterval * 60 * 1000);
    return () => clearInterval(interval);
  }, [waterReminder, waterInterval]);

  // 🔥 Notificação de fotos
  useEffect(() => {
    if (!photoReminder) return;
    const interval = setInterval(async () => {
      const latestGallery = await getLatestGalleryWithin3h();
      if (latestGallery) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Nova galeria disponível 📸",
            body: "Clique para ver a galeria mais recente",
            data: { id: latestGallery },
          },
          trigger: null,
        });
      }
    }, photoInterval * 60 * 1000);
    return () => clearInterval(interval);
  }, [photoReminder, photoInterval]);

  // 🔥 Listener de notificações
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const id = response.notification.request.content.data.id;
      if (id) router.push(`/gallery/${id}`);
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header title="Notificações" />

      <View style={styles.content}>
        {/* BEBER ÁGUA */}
        <Text style={styles.sectionTitle}>Se hidratar</Text>
        <View style={styles.card}>
          <Text style={styles.text}>Ativar lembrete</Text>
          <Switch value={waterReminder} onValueChange={setWaterReminder} />
        </View>
        {waterReminder && (
          <View style={styles.sliderCard}>
            <Text style={styles.sliderLabel}>Intervalo: {waterInterval} min</Text>
            <Slider
              minimumValue={5}
              maximumValue={120}
              step={5}
              value={waterInterval}
              onValueChange={setWaterInterval}
              minimumTrackTintColor={colors.yellow}
            />
          </View>
        )}

        {/* TIRAR FOTOS */}
        <Text style={styles.sectionTitle}>Novas fotos</Text>
        <View style={styles.card}>
          <Text style={styles.text}>Ativar lembrete</Text>
          <Switch value={photoReminder} onValueChange={setPhotoReminder} />
        </View>
        {photoReminder && (
          <View style={styles.sliderCard}>
            <Text style={styles.sliderLabel}>Intervalo: {photoInterval} min</Text>
            <Slider
              minimumValue={5}
              maximumValue={120}
              step={5}
              value={photoInterval}
              onValueChange={setPhotoInterval}
              minimumTrackTintColor={colors.yellow}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// 🔥 Função para pegar a última galeria em 3h
async function getLatestGalleryWithin3h(): Promise<string | null> {
  try {
    const dirs = await FileSystem.readDirectoryAsync(GALLERIES_ROOT);
    let latestGallery: { id: string; createdAt: number } | null = null;

    for (const dir of dirs) {
      const metaPath = `${GALLERIES_ROOT}${dir}/metadata.json`;
      let createdAt = 0;
      try {
        const metaStr = await FileSystem.readAsStringAsync(metaPath);
        const meta = JSON.parse(metaStr);
        createdAt = meta.createdAt ?? 0;
      } catch {}
      if (Date.now() - createdAt <= 3 * 60 * 60 * 1000) {
        if (!latestGallery || createdAt > latestGallery.createdAt) {
          latestGallery = { id: dir, createdAt };
        }
      }
    }
    return latestGallery?.id || null;
  } catch (err) {
    console.error("Erro ao buscar galerias recentes:", err);
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    color: colors.yellow,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: { 
    color: colors.text, 
    fontSize: 16 
  },
  sliderCard: {
    marginTop: 10,
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sliderLabel: {
    color: colors.text,
    marginBottom: 10,
    fontSize: 14,
  },
});