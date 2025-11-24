import { Link, useRouter } from "expo-router";
import { Bell, LogOut } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { useUser } from "../../context/UserContext";
import colors from "../../theme/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    await logout();
    router.replace("/login"); // redireciona para login após logout
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header title="Perfil" />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Informações Pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.name?.charAt(0) || "U").toUpperCase()}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || "..."}</Text>
              <Text style={styles.userEmail}>{user?.email || "..."}</Text>
              <Text style={styles.userRole}>{user?.role || "..."}</Text>
            </View>
          </View>
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <Link href="/profile/notifications" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Bell size={20} color={colors.yellow} />
              </View>
              <Text style={styles.menuText}>Notificações</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuIcon}>
              <LogOut size={20} color={colors.yellow} />
            </View>
            <Text style={styles.menuText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.dark 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: { marginBottom: 32 },
  sectionTitle: { color: colors.yellow, fontSize: 20, fontWeight: "600", marginBottom: 16 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: { color: colors.dark, fontSize: 24, fontWeight: "600" },
  userInfo: { flex: 1 },
  userName: { color: colors.text, fontSize: 18, fontWeight: "600" },
  userEmail: { color: colors.text, opacity: 0.8, fontSize: 14 },
  userRole: { color: colors.text, opacity: 0.7, fontSize: 12, marginTop: 4 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(242, 226, 141, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuText: { color: colors.text, fontSize: 16, fontWeight: "500" },
});