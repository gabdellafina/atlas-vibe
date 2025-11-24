import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import colors from "../../theme/colors";
import { SectionTitle } from "../../components/SectionTitle";
import { Plus } from "lucide-react-native";

export default function SavedPlaces() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header title="Locais Salvos" />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle>Meus locais</SectionTitle>

        <Link href="/camera" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={colors.dark} />
            <Text style={styles.addButtonText}>Adicionar Novo Local</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Você ainda não salvou nenhum local.
          </Text>
          <Text style={styles.emptySubtext}>
            Toque no botão acima para registrar seu primeiro local!
          </Text>
        </View>

        {/* Exemplo de como ficaria com locais */}
        {/* 
        <View style={styles.placeCard}>
          <Text style={styles.placeName}>Parque Central</Text>
          <Text style={styles.placeAddress}>Av. Principal, 123</Text>
          <Text style={styles.placeDate}>Adicionado em 15/12/2024</Text>
        </View>
        */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  addButton: {
    backgroundColor: colors.yellow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  addButtonText: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyCard: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 14,
    textAlign: "center",
  },
  placeCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  placeName: {
    color: colors.yellow,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  placeAddress: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 4,
  },
  placeDate: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 12,
  },
});