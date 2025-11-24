import { Tabs } from "expo-router";
import { BottomTabIcon } from "../../components/BottomTabIcon";
import colors from "../../theme/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.dark,
          borderTopColor: colors.yellow,
          borderTopWidth: 2,
        },
        tabBarActiveTintColor: colors.yellow,
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <BottomTabIcon icon="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: "Galeria",
          tabBarIcon: ({ color }) => <BottomTabIcon icon="image" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <BottomTabIcon icon="user" color={color} />,
        }}
      />
    </Tabs>
  );
}