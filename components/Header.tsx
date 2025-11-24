import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";
import { BeeLogo } from "./BeeLogo";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <BeeLogo />
        <Text style={styles.appName}>Atlas Vibe</Text>
      </View>
      
      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    color: colors.text, // Branco
    fontSize: 24,
    fontWeight: "800", 
    fontFamily: "Poppins_800ExtraBold",
    marginLeft: 12,
  },
  title: {
    color: colors.yellow,
    fontSize: 28,
    fontWeight: "600",
  },
});