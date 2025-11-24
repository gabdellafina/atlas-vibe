// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthProvider";
import { RolesProvider } from "../context/RolesContext";
import { UserProvider } from "../context/UserContext";
import colors from "../theme/colors";

function RootLayoutNav() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.dark, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  const isAuthenticated = !!user;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" redirect={true} />
        </>
      ) : (
        <>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="index" redirect={true} />
          <Stack.Screen name="(tabs)" redirect={true} />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider> 
      <UserProvider>
        <RolesProvider>
          <StatusBar hidden={true} />
          <RootLayoutNav />
        </RolesProvider>
      </UserProvider>
    </AuthProvider>
  );
}