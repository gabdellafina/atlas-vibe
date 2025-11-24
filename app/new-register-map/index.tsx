import { View, Text, StatusBar } from "react-native";
import colors from "../../theme/colors";

export default function NewRegisterMap() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.dark }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={{ color: "white" }}>Mapa — Novo Registro</Text>
    </View>
  );
}