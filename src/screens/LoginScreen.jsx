import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import Feather from "@expo/vector-icons/Feather";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Aviso", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // 1. O login atualiza o estado global no AuthContext
      await login(email, password);
      
      // 2. IMPORTANTE: Não usamos navigation.replace("Home") aqui.
      // No seu App.js, o Navigator vai detectar que o 'user' não é mais null
      // e vai te levar para a Home automaticamente.
      
    } catch (error) {
      Alert.alert("Erro de Acesso", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              
              <View style={styles.header}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>S</Text>
                </View>
                <Text style={styles.title}>ShiftSync</Text>
                <Text style={styles.subtitle}>Gestão de turnos simplificada</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Bem-vindo</Text>

                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Senha"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather 
                      name={showPassword ? "eye" : "eye-off"} 
                      size={22} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleLogin} 
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.footerLinks}>
                  <Text style={styles.footerText}>Não tem uma conta?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.linkText}> Cadastre-se aqui</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: "#D08700",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 15,
  },
  logoText: {
    color: "white",
    fontSize: 40,
    fontWeight: "900",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "#1F2937",
  },
  passwordContainer: {
    width: "100%",
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#1F2937",
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#D08700",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerLinks: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "center",
  },
  footerText: {
    color: "#6B7280",
    fontSize: 14,
  },
  linkText: {
    color: "#D08700",
    fontSize: 14,
    fontWeight: "700",
  },
});