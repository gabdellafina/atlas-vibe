// pages/register.tsx
import { Link, useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BeeLogo } from "../components/BeeLogo";
import { useUser } from "../context/UserContext";
import { registerUser } from "../services/firebase/userService";
import colors from "../theme/colors";

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser } = useUser(); // Atualiza o contexto global
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) return;

    setLoading(true);
    try {
      // Chama registerUser do userService (já cria Auth + Firestore)
      const profile = await registerUser(name, email, password);

      // Atualiza contexto global
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
      });

      // Navega para tabs
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erro no registro:", error);
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = password === confirmPassword;
  const isFormValid = name && email && password && confirmPassword && passwordsMatch;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <BeeLogo size={48} />
          <Text style={styles.appName}>Atlas Vibe</Text>
          <Text style={styles.subtitle}>Crie sua conta</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#777"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Senha"
              placeholderTextColor="#777"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#777" /> : <Eye size={20} color="#777" />}
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirmar senha"
              placeholderTextColor="#777"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} color="#777" /> : <Eye size={20} color="#777" />}
            </TouchableOpacity>
          </View>

          {confirmPassword && !passwordsMatch && (
            <Text style={styles.errorText}>As senhas não coincidem</Text>
          )}

          <TouchableOpacity
            style={[styles.registerButton, (!isFormValid || loading) && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Fazer login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  scrollContent: { flexGrow: 1, padding: 20, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  backButton: { position: "absolute", left: 0, top: 0, padding: 8 },
  appName: { color: colors.text, fontSize: 28, fontWeight: "800", fontFamily: "Poppins_800ExtraBold", marginTop: 12, marginBottom: 8 },
  subtitle: { color: colors.text, opacity: 0.8, fontSize: 16 },
  form: { width: "100%" },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, color: colors.text, fontSize: 16, marginBottom: 16 },
  passwordContainer: { position: "relative" },
  passwordInput: { paddingRight: 50 },
  eyeButton: { position: "absolute", right: 16, top: 16, padding: 4 },
  errorText: { color: "#FF6B6B", fontSize: 14, marginBottom: 16 },
  registerButton: { backgroundColor: colors.yellow, padding: 18, borderRadius: 12, alignItems: "center", marginTop: 8 },
  registerButtonDisabled: { backgroundColor: "#555", opacity: 0.5 },
  registerButtonText: { color: colors.dark, fontSize: 18, fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 24, gap: 8 },
  footerText: { color: colors.text, opacity: 0.8, fontSize: 14 },
  footerLink: { color: colors.yellow, fontSize: 14, fontWeight: "600" },
});