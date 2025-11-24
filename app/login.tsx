import { useAuth } from "@/context/AuthProvider";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BeeLogo } from "../components/BeeLogo";
import { auth } from "../services/firebaseConfig";
import colors from "../theme/colors";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
       
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* Logo e Título */}
        <View style={styles.header}>
          <BeeLogo size={64} />
          <Text style={styles.appName}>Atlas Vibe</Text>
          <Text style={styles.subtitle}>Registre suas experiências</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
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
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color="#777" />
              ) : (
                <Eye size={20} color="#777" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[
              styles.loginButton,
              (!email || !password || loading) && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={!email || !password || loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Link href="./register" asChild>
            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Criar uma conta</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* ============================
        TODO (BACKEND):
        - Implementar login com redes sociais
        - Adicionar "Esqueci minha senha"
        - Validação de campos em tempo real
        ============================ */}
      </View>
    </KeyboardAvoidingView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  appName: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    fontFamily: "Poppins_800ExtraBold",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.text,
    opacity: 0.8,
    fontSize: 16,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    marginBottom: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
  },
  loginButton: {
    backgroundColor: colors.yellow,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: "#555",
    opacity: 0.5,
  },
  loginButtonText: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.text,
    opacity: 0.7,
    marginHorizontal: 16,
    fontSize: 14,
  },
  registerButton: {
    borderWidth: 2,
    borderColor: colors.yellow,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  registerButtonText: {
    color: colors.yellow,
    fontSize: 16,
    fontWeight: "600",
  },
});