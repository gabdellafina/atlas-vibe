// services/notificationServices.ts
import * as FileSystem from "expo-file-system/legacy";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "./firebaseConfig";

// -------------------------------------------
// ROOT POR USUÁRIO
// -------------------------------------------
export function getUserGalleryRoot(userId: string) {
  return `${FileSystem.documentDirectory}roles/${userId}/`;
}

// -------------------------------------------
// FIRESTORE
// -------------------------------------------
export async function saveUserNotificationSettings(userId: string, data: {
  waterReminder: boolean;
  waterInterval: number;
  photoReminder: boolean;
  photoInterval: number;
}) {
  const ref = doc(db, `users/${userId}/settings/notifications`);
  await setDoc(ref, data);
}

export async function getUserNotificationSettings(userId: string) {
  const ref = doc(db, `users/${userId}/settings/notifications`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// -------------------------------------------
// PERMISSÕES
// -------------------------------------------
export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permissão negada", "Não será possível enviar notificações.");
    return false;
  }
  return true;
}

// -------------------------------------------
// GALERIAS
// -------------------------------------------
export async function getLatestGalleryWithin3h(userId: string): Promise<{ id: string; createdAt: number } | null> {
  const root = getUserGalleryRoot(userId);
  try {
    const dirs = await FileSystem.readDirectoryAsync(root);
    let latest: { id: string; createdAt: number } | null = null;

    for (const dir of dirs) {
      const metaPath = `${root}${dir}/metadata.json`;
      try {
        const meta = JSON.parse(await FileSystem.readAsStringAsync(metaPath));
        const createdAt = meta.createdAt ?? 0;
        if (Date.now() - createdAt <= 3 * 60 * 60 * 1000) {
          if (!latest || createdAt > latest.createdAt) latest = { id: dir, createdAt };
        }
      } catch {}
    }
    return latest;
  } catch (err) {
    console.error("Erro ao buscar galerias recentes:", err);
    return null;
  }
}

// -------------------------------------------
// NOTIFICAÇÕES
// -------------------------------------------
export async function scheduleHydrationNotification(userId: string, intervalMinutes: number) {
  const latestGallery = await getLatestGalleryWithin3h(userId);
  if (!latestGallery) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hora de se hidratar 💧",
      body: "Não esqueça de beber água!",
    },
    trigger: {
      type: "timeInterval",
      seconds: Math.max(intervalMinutes * 60, 1),
      repeats: true,
    } as any,
  });
}

export async function schedulePhotoNotification(userId: string, intervalMinutes: number) {
  const latestGallery = await getLatestGalleryWithin3h(userId);
  if (!latestGallery) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Role começado! 📸",
      body: "Adicione novas fotos à sua galeria.",
      data: { id: latestGallery.id },
    },
    trigger: {
      type: "timeInterval",
      seconds: Math.max(intervalMinutes * 60, 1),
      repeats: true,
    } as any,
  });
}

export async function scheduleAskContinueNotification(userId: string) {
  const latestGallery = await getLatestGalleryWithin3h(userId);
  if (!latestGallery) return;

  const elapsed = Date.now() - latestGallery.createdAt;
  const remainingSeconds = Math.max(3 * 60 * 60 - elapsed, 1);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Notificações pausadas ⏸️",
      body: "Não há galerias recentes. Quer continuar recebendo notificações?",
      data: { action: "askContinue" },
    },
    trigger: {
      type: "timeInterval",
      seconds: remainingSeconds,
      repeats: false,
    } as any,
  });
}

// -------------------------------------------
// RESPOSTA DE NOTIFICAÇÕES
// -------------------------------------------
export function handleNotificationResponse(
  response: Notifications.NotificationResponse,
  userId: string,
  waterInterval: number,
  photoInterval: number
) {
  const data = response.notification.request.content.data;

  if (data.id) {
    router.push(`/gallery/${data.id}`);
  } else if (data.action === "askContinue") {
    Alert.alert(
      "Continuar notificações?",
      "Deseja continuar recebendo lembretes?",
      [
        { text: "Não", onPress: async () => await Notifications.cancelAllScheduledNotificationsAsync() },
        {
          text: "Sim",
          onPress: async () => {
            await scheduleHydrationNotification(userId, waterInterval);
            await schedulePhotoNotification(userId, photoInterval);
          },
        },
      ]
    );
  }
}

// -------------------------------------------
// AGENDAR A PARTIR DO FIRESTORE
// -------------------------------------------
export async function scheduleNotificationsFromFirestore(userId: string) {
  const data = await getUserNotificationSettings(userId);
  if (!data) return;

  const { waterReminder, waterInterval, photoReminder, photoInterval } = data;

  // cancela apenas notificações do app
  await Notifications.cancelAllScheduledNotificationsAsync();

  const latestGallery = await getLatestGalleryWithin3h(userId);
  if (!latestGallery) {
    await scheduleAskContinueNotification(userId);
    return;
  }

  if (waterReminder) await scheduleHydrationNotification(userId, waterInterval);
  if (photoReminder) await schedulePhotoNotification(userId, photoInterval);
}
